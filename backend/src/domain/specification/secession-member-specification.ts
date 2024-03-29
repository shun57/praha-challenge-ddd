import { CleanPrismaService } from "src/infra/db/prisma.service";
import { NotExistJoinPairNotifyMail } from "../entity/pair/not-exist-join-pair-notify-mail";
import { Pair } from "../entity/pair/pair";
import { Participant } from "../entity/participant/participant";
import { Team } from "../entity/team/team";
import { TeamMemberNotSatisfiedNotifyMail } from "../entity/team/team-member-not-satisfied-notify-mail";
import { IMailRepository } from "../interface/mail/mail-repository";
import { IPairRepository } from "../interface/pair/pair-repository";

export class SecessionMemberSpecification {
  private pairRepo: IPairRepository
  private mailRepo: IMailRepository
  public constructor(
    pairRepo: IPairRepository,
    mailRepo: IMailRepository
  ) {
    this.pairRepo = pairRepo
    this.mailRepo = mailRepo
  }

  public async moveAnotherMinPairIfPairMemberNotFilled(minPair: Pair | undefined, currentPair: Pair, secessionedParticipant: Participant, prisma: CleanPrismaService): Promise<void> {
    // 合流先のペアがない場合は通知を送る
    if (!minPair) {
      const notExistJoinPairNotifyMail = new NotExistJoinPairNotifyMail()
      const email = notExistJoinPairNotifyMail.buildEmail(secessionedParticipant, currentPair.participantIds[0]!)
      await this.mailRepo.send(email)
    } else {
      // 新しいペアに加える
      minPair.join(currentPair.participantIds[0]!)
      // 既存ペアが0人になるので削除する
      await this.pairRepo.deleteInTransaction(currentPair, prisma)
      // 新しいペアを保存する
      await this.pairRepo.saveInTransaction(minPair, prisma)
    }
  }
}