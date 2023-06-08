import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { ITeamRepository } from "src/domain/interface/team/team-repository"

export class GetAllTeamsUseCase {
    public constructor(
        @Inject(ConstantTokens.TEAM_REPOSITORY)
        private readonly teamRepo: ITeamRepository
    ) { }

    public async do() {
        try {
            return await this.teamRepo.getAll()
        } catch (error) {
            throw error
        }
    }
}
