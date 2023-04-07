import { Inject } from "@nestjs/common"
import { IPairRepository } from "src/domain/interface/pair/pair-repository"
import { ConstantTokens } from "src/shared/constants"

export class GetAllPairsUseCase {
    public constructor(
        @Inject(ConstantTokens.PAIR_REPOSITORY)
        private readonly pairRepo: IPairRepository
    ) { }

    public async do() {
        try {
            return await this.pairRepo.getAll()
        } catch (error) {
            throw error
        }
    }
}
