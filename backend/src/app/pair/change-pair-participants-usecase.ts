import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { IPairRepository } from "src/domain/interface/pair/pair-repository";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { PairService } from "src/domain/service/pair-service";
import { Pair } from "src/domain/entity/pair/pair";
import { ParticipantIdsMapper } from "src/infra/mapper/participant-ids-mapper";
import { IParticipantRepository } from "src/domain/interface/participant/participant-repository";
import { CheckParticipantEnrollmentSpecification } from "src/domain/specification/check-participant-enrollment-specification";

export class ChangePairParticipantsUseCase {
  public constructor(
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairRepo: IPairRepository,
    @Inject(ConstantTokens.PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
  ) { }

  public async do(params: { pairId: string, newParticipantIds: string[] }) {
    try {
      // ペアを取得
      const pair = await this.pairRepo.getById(PairId.create(new UniqueEntityID(params.pairId)))
      if (!pair) {
        throw new Error("対象のペアが存在しません。")
      }
      // 参加者IDを作成
      const participantIds = ParticipantIdsMapper.toEntity(params.newParticipantIds)
      const checkParticipantEnrollmentSpecification = new CheckParticipantEnrollmentSpecification(this.participantRepo)
      // 参加者は在籍中か？
      if (!await checkParticipantEnrollmentSpecification.isEnrolledIn(participantIds)) {
        throw new Error("参加者が在籍中ではない場合、ペアにできません。")
      }
      // 参加者は同じチームか？
      const pairService = new PairService(this.pairRepo)
      if (!await pairService.isSameTeamBy(participantIds)) {
        throw new Error("同じチームの参加者でなければペアにできません。")
      }
      // 新しいペアを作成
      const newParticipantPair = Pair.create(
        { name: pair.name, teamId: pair.teamId, participantIds: participantIds }
        , pair.pairId.id)
      await this.pairRepo.save(newParticipantPair)
    } catch (error) {
      throw error
    }
  }
}