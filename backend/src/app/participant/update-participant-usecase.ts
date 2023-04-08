import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ITeamRepository } from "src/domain/interface/team/team-repository";
import { IPairRepository } from "src/domain/interface/pair/pair-repository";
import { SecessionMemberSpecification } from "src/domain/specification/secession-member-specification";
import { ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { IParticipantRepository } from "src/domain/interface/participant/participant-repository";
import { IMailRepository } from "src/domain/interface/mail/mail-repository";
import { PairService } from "src/domain/service/pair-service";
import { TeamService } from "src/domain/service/team-service";
import { PrismaService } from "src/infra/db/prisma.service";

export class UpdateParticipantUseCase {
  public constructor(
    @Inject(ConstantTokens.PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
    @Inject(ConstantTokens.TEAM_REPOSITORY) private readonly teamRepo: ITeamRepository,
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairRepo: IPairRepository,
    @Inject(ConstantTokens.MAIL_REPOSITORY) private readonly mailRepo: IMailRepository,
    private readonly prisma: PrismaService,
  ) { }

  public async do(params: { participantId: string, enrollmentStatus: string }) {
    const { participantId, enrollmentStatus } = params
    const newEnrollmentStatus = ParticipantEnrollmentStatus.create({ value: enrollmentStatus })

    try {
      // 現在の参加者を取得
      const participant = await this.participantRepo.getById(ParticipantId.create(new UniqueEntityID(participantId)))
      if (!participant) {
        throw new Error("対象の会員が存在しません。")
      }

      await this.prisma.$transaction(async (prisma) => {
        const pairService = new PairService(this.pairRepo)

        // 増減する場合、復帰・脱退処理を行う
        if (participant.isComeback(newEnrollmentStatus)) {
          const teamService = new TeamService(this.teamRepo)
          // 最少人数のチームを取得
          const minTeam = await teamService.getMinimumTeam()
          if (!minTeam) {
            throw new Error("最少人数のチームがありませんでした。")
          }
          // 最少人数のペアを取得
          const minPair = await pairService.getMinimumPairBy(minTeam)
          if (!minPair) {
            throw new Error("最少人数のペアがありませんでした。")
          }
          // ペアが最大人数を超えた場合、分解して保存
          await pairService.devidePairIfOverMember(minPair, participant.participantId, prisma)

        } else if (participant.isSecession(newEnrollmentStatus)) {
          // 脱退し、ペアとチームから抜ける
          const currentPair = await this.pairRepo.getByParticipantId(participant.participantId)
          if (!currentPair) {
            throw new Error("脱退対象のペアがありませんでした。")
          }
          currentPair.remove(participant.participantId)
          // ペアから参加者を減らす
          await this.pairRepo.saveInTransaction(currentPair, prisma)

          const secessionMemberSpecification = new SecessionMemberSpecification(this.teamRepo, this.pairRepo, this.participantRepo, this.mailRepo)
          // 脱退したことでペアの参加者数が条件を満たさない場合、残りのペアメンバーを移動する
          await secessionMemberSpecification.moveAnotherPairIfPairMemberNotFilled(currentPair, participant, pairService, prisma)
          // チームの参加者数が条件を満たさなくなった場合、アラートメールを送る
          secessionMemberSpecification.sendAlertMailToAdminerIfTeamMemberNotFilled(participant, currentPair)

        }
        // 参加者の在籍ステータスを更新して保存
        participant.updateEnrollmentStatus(newEnrollmentStatus)
        await this.participantRepo.saveInTransaction(participant, prisma)
      })
    } catch (error) {
      throw error
    }
  }
}