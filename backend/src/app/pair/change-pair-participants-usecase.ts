import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { IPairRepository } from "src/domain/interface/pair/repository-interface/pair-repository";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { PairService } from "src/domain/service/pair-service";
import { Pair } from "src/domain/entity/pair/pair";

export class ChangePairParticipantsUseCase {
  public constructor(
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairRepo: IPairRepository,
  ) { }

  public async do(params: { pairId: string, newParticipantIds: string[] }) {
    try {
      // ペアを取得
      const pair = await this.pairRepo.getById(PairId.create(new UniqueEntityID(params.pairId)))
      if (!pair) {
        throw new Error("対象のペアが存在しません。")
      }
      // 参加者IDを作成
      let participantIds: ParticipantId[] = []
      params.newParticipantIds.map((newParticipantId) => {
        participantIds.push(ParticipantId.create(new UniqueEntityID(newParticipantId)))
      })
      // 参加者を入れ替え
      const newParticipantPair = Pair.create({ name: pair.name, teamId: pair.teamId, participantIds: participantIds })
      // 同じチームかどうか？
      const pairService = new PairService(this.pairRepo)
      if (!await pairService.isSameTeamBy(newParticipantPair)) {
        throw new Error("同じチームの会員でなければペアにできません。")
      }
      await this.pairRepo.save(newParticipantPair)
    } catch (error) {
      throw error
    }
  }
}