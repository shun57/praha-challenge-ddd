import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { TeamRepository } from "src/app/team/query-service-interface/team-repository"

export class GetAllTeamsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY)
        private readonly teamRepository: TeamRepository
    ) { }

    public async do() {
        try {
            return await this.teamRepository.getAll()
        } catch (error) {
            throw error
        }
    }
}
