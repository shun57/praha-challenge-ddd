import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ComeBackMemberSpecification } from "src/domain/specification/come-back-member-specification";
import { ITeamRepository } from "src/domain/interface/team/team-repository";
import { IPairRepository } from "src/domain/interface/pair/pair-repository";
import { SecessionMemberSpecification } from "src/domain/specification/secession-member-specification";
import { ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { IParticipantRepository } from "src/domain/interface/participant/participant-repository";
import { IEmailRepository } from "src/domain/interface/mail/mail-repository";
import { IPairMemberRepository } from "src/domain/interface/pair-member/pair-member-repository";

export class UpdateParticipantUseCase {
  public constructor(
    @Inject(ConstantTokens.PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
    @Inject(ConstantTokens.TEAM_REPOSITORY) private readonly teamRepo: ITeamRepository,
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairRepo: IPairRepository,
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairMemberRepo: IPairMemberRepository,
    @Inject(ConstantTokens.MAIL_REPOSITORY) private readonly mailRepo: IEmailRepository,
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
      // TODO：トランザクション処理
      // 増減する場合、復帰・脱退処理を行う
      if (participant.isComeback(newEnrollmentStatus)) {
        const comeBackMemberSpecification = new ComeBackMemberSpecification(this.teamRepo, this.pairRepo)
        // 最少人数のチームを取得
        const minTeam = await comeBackMemberSpecification.getMinimumTeamToJoin()
        if (!minTeam) {
          throw new Error("最少人数のチームがありませんでした。")
        }
        // 最少人数のペアを取得
        const minPair = await comeBackMemberSpecification.getMinimumPairToJoin(minTeam)
        if (!minPair) {
          throw new Error("最少人数のペアがありませんでした。")
        }
        // ペアが最大人数を超えた場合分解して保存
        await comeBackMemberSpecification.devidePairIfOverMember(minPair, participant.participantId)

      } else if (participant.isSecession(newEnrollmentStatus)) {
        // 脱退し、ペアとチームから抜ける
        const secessionMemberSpecification = new SecessionMemberSpecification(this.teamRepo, this.pairRepo, this.pairMemberRepo, this.participantRepo, this.mailRepo)
        // ペアの参加者数が条件を満たさなくなった場合、別ペアに合流させる
        const pair = await secessionMemberSpecification.moveAnotherPairIfPairMemberNotFilled(participant)
        // チームの参加者数が条件を満たさなくなった場合、アラートメールを送る
        secessionMemberSpecification.sendAlertMailIToAdminerIfTeamMemberNotFilled(participant, pair)

      }
      // 参加者の在籍ステータスを更新して保存
      participant.updateEnrollmentStatus(newEnrollmentStatus)
      await this.participantRepo.save(participant)

    } catch (error) {
      throw error
    }
  }
}