import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { ITeamRepository } from "src/domain/interface/team/repository-interface/team-repository";
import { TeamId } from "src/domain/value-object/team/team-id";
import { TeamMemberSatisfySpecification } from "src/domain/specification/team-member-satisfy-specification";
import { Team } from "src/domain/entity/team/team";
import { IPairRepository } from "src/domain/interface/pair/repository-interface/pair-repository";

export class ChangeTeamPairsUseCase {
  public constructor(
    @Inject(ConstantTokens.MEMBERSHIP_REPOSITORY) private readonly pairRepo: IPairRepository,
    @Inject(ConstantTokens.TEAM_REPOSITORY) private readonly teamRepo: ITeamRepository,
  ) { }

  public async do(params: { teamId: string, newPairIds: string[] }) {
    try {
      // 対象チームを取得
      const team = await this.teamRepo.getById(TeamId.create(new UniqueEntityID(params.teamId)))
      if (!team) {
        throw new Error("対象のチームが存在しません。")
      }
      // ペアIDを作成
      let newPairIds: PairId[] = []
      params.newPairIds.map((pairId) => {
        newPairIds.push(PairId.create(new UniqueEntityID(pairId)))
      })
      // ペアを入れ替える
      const newTeam = Team.create({
        name: team.name,
        pairIds: newPairIds,
      })
      // 最低参加者数を満たしているか
      const teamMemberSatisfySpecification = new TeamMemberSatisfySpecification(this.pairRepo)
      if (!await teamMemberSatisfySpecification.isSatisfiedBy(newTeam)) {
        throw new Error("チームの最低所属人数を満たしていません。")
      }
      // チームを更新する
      await this.teamRepo.save(newTeam)
    } catch (error) {
      throw error
    }
  }
}