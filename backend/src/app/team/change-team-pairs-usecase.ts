import { Inject, NotFoundException } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"
import { ITeamRepository } from "src/domain/interface/team/team-repository"
import { TeamId } from "src/domain/value-object/team/team-id"
import { Team } from "src/domain/entity/team/team"
import { IPairRepository } from "src/domain/interface/pair/pair-repository"
import { ParticipantId } from "src/domain/value-object/participant/participant-id"
import { PairIdsMapper } from "src/infra/mapper/pair-ids-mapper"

export class ChangeTeamPairsUseCase {
  public constructor(
    @Inject(ConstantTokens.PAIR_REPOSITORY) private readonly pairRepo: IPairRepository,
    @Inject(ConstantTokens.TEAM_REPOSITORY) private readonly teamRepo: ITeamRepository,
  ) { }

  public async do(params: { teamId: string, newPairIds: string[] }) {
    try {
      // 対象チームを取得
      const team = await this.teamRepo.getById(TeamId.create(new UniqueEntityID(params.teamId)))
      if (!team) {
        throw new NotFoundException("対象のチームが存在しません。")
      }
      // ペアIDを作成
      const newPairIds = PairIdsMapper.toEntity(params.newPairIds)
      const newPairs = await this.pairRepo.getByIds(newPairIds)
      // ペアのすべての参加者IDを取得
      const participantIds: ParticipantId[] = newPairs.flatMap(newPair => newPair.participantIds);
      // ペアを入れ替える
      const newTeam = Team.create({
        name: team.name,
        pairIds: newPairIds,
        participantIds: participantIds
      }, team.teamId.id)
      // チームを更新する
      await this.teamRepo.save(newTeam)
    } catch (error) {
      throw error
    }
  }
}