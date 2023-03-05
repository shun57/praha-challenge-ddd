import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { TeamQS } from "src/app/team/query-service-interface/team-qs"

export class GetAllTeamsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY)
        private readonly teamQS: TeamQS
    ) { }

    public async do() {
        try {
            return await this.teamQS.getAll()
        } catch (error) {
            throw error
        }
    }
}
