import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { PairQS } from "src/app/pair/query-service-interface/pair-qs"

export class GetAllPairsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY)
        private readonly pairQS: PairQS
    ) { }

    public async do() {
        try {
            return await this.pairQS.getAll()
        } catch (error) {
            throw error
        }
    }
}
