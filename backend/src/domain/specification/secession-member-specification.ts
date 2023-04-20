import { CleanPrismaService } from "src/infra/db/prisma.service";
import { NotExistJoinPairNotifyMail } from "../entity/pair/not-exist-join-pair-notify-mail";
import { Pair } from "../entity/pair/pair";
import { Participant } from "../entity/participant/participant";
import { Team } from "../entity/team/team";
import { TeamMemberNotSatisfiedNotifyMail } from "../entity/team/team-member-not-satisfied-notify-mail";
import { IMailRepository } from "../interface/mail/mail-repository";
import { IPairRepository } from "../interface/pair/pair-repository";
import { IParticipantRepository } from "../interface/participant/participant-repository";
import { PairService } from "../service/pair-service";

export class SecessionMemberSpecification {
  private pairRepo: IPairRepository
  private participantRepo: IParticipantRepository
  private mailRepo: IMailRepository
  public constructor(
    pairRepo: IPairRepository,
    participantRepo: IParticipantRepository,
    mailRepo: IMailRepository
  ) {
    this.pairRepo = pairRepo
    this.participantRepo = participantRepo
    this.mailRepo = mailRepo
  }

  public async sendAlertMailToAdminerIfTeamMemberNotFilled(withdrawParticipant: Participant, team: Team): Promise<void> {
    // チームの参加者を取得
    const teamMembers = await this.participantRepo.getByIds(team.participantIds)
    // メール送信
    const teamMemberNotSatisfiedNotifyMail = new TeamMemberNotSatisfiedNotifyMail()
    const email = teamMemberNotSatisfiedNotifyMail.buildEmail(team, withdrawParticipant, teamMembers)
    await this.mailRepo.send(email)
  }

  public async moveAnotherMinPairIfPairMemberNotFilled(currentPairTeam: Team, currentPair: Pair, participant: Participant, pairService: PairService, prisma: CleanPrismaService): Promise<void> {
    // 一番人数の少ないペアを取得
    const minPair = await pairService.getMinimumPairBy(currentPairTeam)
    // ペアの残りメンバーを取得
    const pairMembers = currentPair.participantIds.filter((participantId) => participantId !== participant.participantId)
    // 合流先のペアがない場合は通知を送る
    if (!minPair) {
      const notExistJoinPairNotifyMail = new NotExistJoinPairNotifyMail()
      const email = notExistJoinPairNotifyMail.buildEmail(participant, pairMembers[0]!)
      await this.mailRepo.send(email)
    } else {
      // 合流先ペアがある場合、現ペアから抜いて新しいペアに加える
      currentPair.remove(pairMembers[0]!)
      minPair.join(pairMembers[0]!)

      await this.pairRepo.saveInTransaction(currentPair, prisma)
      await this.pairRepo.saveInTransaction(minPair, prisma)
    }
  }
}