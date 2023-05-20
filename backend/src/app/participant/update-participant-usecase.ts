import { Inject, NotFoundException } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ITeamRepository } from "src/domain/interface/team/team-repository";
import { IPairRepository } from "src/domain/interface/pair/pair-repository";
import { ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { IParticipantRepository } from "src/domain/interface/participant/participant-repository";
import { IMailRepository } from "src/domain/interface/mail/mail-repository";
import { PairService } from "src/domain/service/pair-service";
import { PrismaService } from "src/infra/db/prisma.service";
import { IPairQS } from "../pair/query-service-interface/pair-qs";
import { TeamMemberNotSatisfiedNotifyMail } from "src/domain/entity/team/team-member-not-satisfied-notify-mail";
import { NotExistJoinPairNotifyMail } from "src/domain/entity/pair/not-exist-join-pair-notify-mail";
import { Participant } from "src/domain/entity/participant/participant";
import { Team } from "src/domain/entity/team/team";
import { Pair } from "src/domain/entity/pair/pair";

export class UpdateParticipantUseCase {
  public constructor(
    @Inject(ConstantTokens.PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
    @Inject(ConstantTokens.TEAM_REPOSITORY) private readonly teamRepo: ITeamRepository,
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairRepo: IPairRepository,
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairQS: IPairQS,
    @Inject(ConstantTokens.MAIL_REPOSITORY) private readonly mailRepo: IMailRepository,
    private readonly prisma: PrismaService,
  ) { }

  public async do(params: { participantId: string, enrollmentStatus: string }) {
    const { participantId, enrollmentStatus } = params

    try {
      const newEnrollmentStatus = ParticipantEnrollmentStatus.create({ value: enrollmentStatus })
      const participant = await this.participantRepo.getById(ParticipantId.create(new UniqueEntityID(participantId)))
      if (!participant) {
        throw new NotFoundException("対象の会員が存在しません。")
      }
      // 復帰の場合
      if (participant.isComeback(newEnrollmentStatus)) {
        await this.handleComeback(newEnrollmentStatus, participant)
        return
      }
      // 脱退の場合
      if (participant.isSecession(newEnrollmentStatus)) {
        await this.handleSecession(newEnrollmentStatus, participant)
        return
      }
      // 参加者の在籍ステータスを更新
      participant.updateEnrollmentStatus(newEnrollmentStatus)
      await this.participantRepo.save(participant)
    } catch (error) {
      throw error
    }
  }

  // 復帰処理
  private async handleComeback(newEnrollmentStatus: ParticipantEnrollmentStatus, participant: Participant) {
    const pairService = new PairService(this.pairRepo, this.pairQS)
    // 最少人数チームの中の最少人数ペアを取得
    const minPair = await pairService.getMinPairOfMinTeam()

    await this.prisma.$transaction(async (prisma) => {
      // 最大人数を超える場合はペアを分解する
      if (minPair.isMaxParticipants()) {
        const [pair, newPair] = await pairService.devidePair(minPair, participant.participantId)
        await this.pairRepo.saveInTransaction(pair, prisma)
        await this.pairRepo.saveInTransaction(newPair, prisma)
      } else {
        // ペアに参加する
        minPair.join(participant.participantId)
        await this.pairRepo.saveInTransaction(minPair, prisma)
      }

      participant.updateEnrollmentStatus(newEnrollmentStatus)
      await this.participantRepo.saveInTransaction(participant, prisma)
    })
  }

  // 脱退処理
  private async handleSecession(newEnrollmentStatus: ParticipantEnrollmentStatus, participant: Participant) {
    // 所属ペアとチームを取得
    const currentPair = await this.pairRepo.getByParticipantId(participant.participantId)
    if (!currentPair) {
      throw new NotFoundException("脱退対象のペアがありませんでした。")
    }
    const currentPairTeam = await this.teamRepo.getById(currentPair.teamId)
    if (!currentPairTeam) {
      throw new NotFoundException("脱退対象のチームがありませんでした。")
    }
    // 脱退することでチームの最少人数を下回る場合、アラート
    if (currentPairTeam.isMinParticipants()) {
      await this.teamMemberNotSatisfiedNotifyMail(participant, currentPairTeam)
      throw new Error("チームの参加者が最少人数を下回るため脱退できません。管理者に連絡してください。")
    }
    // 脱退することでペアの最少人数を下回る場合、残りメンバーを別ペアに移動する
    if (currentPair.isMinParticipants()) {
      // 脱退してステータスを更新 FIX: 在籍中ではない場合はチームやペアに所属できないドメインルールが守れない
      const anotherPair = await this.moveRestMemberToMinPair(participant, currentPair, currentPairTeam)
      await this.prisma.$transaction(async (prisma) => {
        // 現ペアを削除
        await this.pairRepo.deleteInTransaction(currentPair, prisma)
        // 移動先ペアを保存
        await this.pairRepo.saveInTransaction(anotherPair, prisma)
        // 参加者の在籍ステータスを更新
        participant.updateEnrollmentStatus(newEnrollmentStatus)
        await this.participantRepo.saveInTransaction(participant, prisma)
      })
      return
    }
    // 通常の脱退処理
    await this.prisma.$transaction(async (prisma) => {
      currentPair.remove(participant.participantId)
      await this.pairRepo.saveInTransaction(currentPair, prisma)
      participant.updateEnrollmentStatus(newEnrollmentStatus)
      await this.participantRepo.saveInTransaction(participant, prisma)
    })
  }

  // 管理者にメール送信
  private async teamMemberNotSatisfiedNotifyMail(participant: Participant, currentPairTeam: Team) {
    const teamMembers = await this.participantRepo.getByIds(currentPairTeam.participantIds)
    const teamMemberNotSatisfiedNotifyMail = new TeamMemberNotSatisfiedNotifyMail()
    const email = teamMemberNotSatisfiedNotifyMail.buildEmail(currentPairTeam, participant, teamMembers)
    await this.mailRepo.send(email)
  }

  // 別の最少人数ペアに残りのメンバーを移動
  private async moveRestMemberToMinPair(participant: Participant, currentPair: Pair, currentPairTeam: Team) {
    const pairService = new PairService(this.pairRepo, this.pairQS)
    const minPair = await pairService.getMinPairByTeamWithoutCurrentPair(currentPairTeam, currentPair)

    // 合流先のペアがなかった場合、アラート
    if (!minPair) {
      const notExistJoinPairNotifyMail = new NotExistJoinPairNotifyMail()
      const email = notExistJoinPairNotifyMail.buildEmail(participant, currentPair.participantIds[0]!)
      await this.mailRepo.send(email)
      throw new Error("ペアの参加者が最少人数を下回るため脱退できません。管理者に連絡してください。")
    }
    // 残りのメンバーを別ペアに合流させる
    const restParticipantId = currentPair.participantIds.filter((pariticipantId) => pariticipantId !== participant.participantId)
    minPair.join(restParticipantId[0]!)
    return minPair
  }
}
