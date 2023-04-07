import { NotExistJoinPairNotifyMail } from "../entity/pair/not-exist-join-pair-notify-mail"
import { Pair } from "../entity/pair/pair"
import { Participant } from "../entity/participant/participant"
import { TeamMemberNotSatisfiedNotifyMail } from "../entity/team/team-member-not-satisfied-notify-mail"
import { IMailRepository } from "../interface/mail/mail-repository"
import { IPairMemberRepository } from "../interface/pair-member/pair-member-repository"
import { IPairRepository } from "../interface/pair/pair-repository"
import { IParticipantRepository } from "../interface/participant/participant-repository"
import { ITeamRepository } from "../interface/team/team-repository"
import { ComeBackMemberSpecification } from "./come-back-member-specification"
import { TeamMemberSatisfySpecification } from "./team-member-satisfy-specification"

export class SecessionMemberSpecification {
  private teamRepo: ITeamRepository
  private pairRepo: IPairRepository
  private pairMemberRepo: IPairMemberRepository
  private participantRepo: IParticipantRepository
  private mailRepo: IMailRepository
  public constructor(
    teamRepo: ITeamRepository,
    pairRepo: IPairRepository,
    pairMemberRepo: IPairMemberRepository,
    participantRepo: IParticipantRepository,
    mailRepo: IMailRepository
  ) {
    this.teamRepo = teamRepo
    this.pairRepo = pairRepo
    this.pairMemberRepo = pairMemberRepo
    this.participantRepo = participantRepo
    this.mailRepo = mailRepo
  }

  public async moveAnotherPairIfPairMemberNotFilled(participant: Participant): Promise<Pair> {
    const pair = await this.pairRepo.getByParticipantId(participant.participantId)
    if (!pair) {
      throw new Error("脱退対象のペアがありませんでした。")
    }
    // ペア人数が最少人数を下回る場合、同チームで参加者人数が最少の別ペアに合流させる
    if (pair.isMinParticipants()) {
      const team = await this.teamRepo.getById(pair.teamId)
      if (!team) {
        throw new Error("脱退対象のチームがありませんでした。")
      }
      // チームの対象ペアを廃止
      team.removePair(pair.pairId)
      // 他の一番人数の少ないペアを取得
      const comeBackMemberSpecification = new ComeBackMemberSpecification(this.teamRepo, this.pairRepo)
      const minPair = await comeBackMemberSpecification.getMinimumPairToJoin(team)
      // ペアの残りメンバーを取得
      const pairMembers = pair.participantIds.filter((participantId) => participantId !== participant.participantId)
      // 合流先のペアがない場合は通知を送る
      if (!minPair) {
        const notExistJoinPairNotifyMail = new NotExistJoinPairNotifyMail()
        const email = notExistJoinPairNotifyMail.buildEmail(participant, pairMembers[0]!)
        await this.mailRepo.send(email)
      } else {
        // 合流先ペアがある場合、現ペアから抜いて加える
        pair.remove(pairMembers[0]!)
        minPair.join(pairMembers[0]!)
        await this.pairRepo.save(minPair)
      }
    }
    // ペアから参加者を減らす
    pair.remove(participant.participantId)
    await this.pairRepo.save(pair)
    return pair
  }

  public async sendAlertMailIToAdminerIfTeamMemberNotFilled(withdrawParticipant: Participant, pair: Pair): Promise<void> {
    // TODO：チームの参加者数を取得する処理を切り出し
    // 現在のチームを取得
    const team = await this.teamRepo.getById(pair.teamId)
    if (!team) {
      throw new Error("脱退対象のチームがありませんでした。")
    }
    // チームが最少人数を満たさなくなった場合
    const teamMemberSatisfySpecification = new TeamMemberSatisfySpecification(this.pairRepo)
    if (!await teamMemberSatisfySpecification.isSatisfiedBy(team)) {
      // チームの参加者を取得
      const pairMembers = await this.pairMemberRepo.getByPairIds(team.pairIds)
      const participantIds = pairMembers.map(pairMember => pairMember.participantId)
      const teamMembers = await this.participantRepo.getByIds(participantIds)
      // メール送信
      const teamMemberNotSatisfiedNotifyMail = new TeamMemberNotSatisfiedNotifyMail()
      const email = teamMemberNotSatisfiedNotifyMail.buildEmail(team, withdrawParticipant, teamMembers)
      await this.mailRepo.send(email)
    }
  }
}