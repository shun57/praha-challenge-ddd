import { ParticipantRepository } from "src/app/participant/query-service-interface/participant-repository"

export class GetAllParticipantsUseCase {
    public constructor(private readonly participantRepository: ParticipantRepository) { }

    public async handle() {
        try {
            return await this.participantRepository.getAll()
        } catch (error) {
            throw error
        }
    }
}
