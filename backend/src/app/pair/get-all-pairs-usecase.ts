import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IPairQS } from "src/app/pair/query-service-interface/pair-qs"

export class GetAllPairsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY)
        private readonly pairQS: IPairQS
    ) { }

    public async do() {
        try {
            return await this.pairQS.getAll()
        } catch (error) {
            throw error
        }
    }
}
