import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { ParticipantRepository } from "src/app/participant/query-service-interface/participant-repository"

export class GetAllParticipantsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY)
        private readonly participantRepository: ParticipantRepository
    ) { }

    public async handle() {
        try {
            return await this.participantRepository.getAll()
        } catch (error) {
            throw error
        }
    }
}
