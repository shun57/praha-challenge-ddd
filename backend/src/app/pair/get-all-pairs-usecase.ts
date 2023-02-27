import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { PairRepository } from "src/app/pair/query-service-interface/pair-repository"

export class GetAllPairsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY)
        private readonly pairRepository: PairRepository
    ) { }

    public async handle() {
        try {
            return await this.pairRepository.getAll()
        } catch (error) {
            throw error
        }
    }
}
