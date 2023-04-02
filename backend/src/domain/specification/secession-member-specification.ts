import { Pair } from "../entity/pair/pair"
import { Participant } from "../entity/participant/participant"
import { IPairRepository } from "../interface/pair/repository-interface/pair-repository"
import { ITeamRepository } from "../interface/team/repository-interface/team-repository"
import { ComeBackMemberSpecification } from "./come-back-member-specification"
import { TeamMemberSatisfySpecification } from "./team-member-satisfy-specification"

export class SecessionMemberSpecification {
  private teamRepo: ITeamRepository
  private pairRepo: IPairRepository
  public constructor(teamRepo: ITeamRepository, pairRepo: IPairRepository) {
    this.teamRepo = teamRepo
    this.pairRepo = pairRepo
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
      if (!minPair) {
        // 管理者にメールする
        // どの参加者が減ったか
        // どの参加者が合流先を探しているか
        throw new Error("合流先のペアがありませんでした。")
      }
      // ペアの残りメンバーを取得
      const pairMembers = pair.participantIds.filter((participantId) => participantId !== participant.participantId)
      // 現ペアから抜いて別ペアに加える
      pair.remove(pairMembers[0]!)
      minPair.join(pairMembers[0]!)
      await this.pairRepo.save(minPair)
    }
    // ペアから参加者を減らす
    pair.remove(participant.participantId)
    await this.pairRepo.save(pair)
    return pair
  }

  public async sendAlertMailIToAdminerIfTeamMemberNotFilled(participant: Participant, pair: Pair): Promise<void> {
    // TODO：チームの参加者数を取得する処理を切り出し

    // 現在のチームを取得
    const team = await this.teamRepo.getById(pair.teamId)
    if (!team) {
      throw new Error("脱退対象のチームがありませんでした。")
    }
    // チームが最少人数を満たさなくなった場合
    const teamMemberSatisfySpecification = new TeamMemberSatisfySpecification(this.pairRepo)
    if (!await teamMemberSatisfySpecification.isSatisfiedBy(team)) {
      // メール送信
      // どの参加者が減ったか？
      // どのチームが2名以下になったか？
      // そのチームの現在の参加者名
    }
  }
}