import { Participant } from "../entity/participant/participant"
import { IParticipantRepository } from "src/domain/interface/participant/participant-repository"


export class ParticipantService {
  private participantRepo: IParticipantRepository
  public constructor(participantRepo: IParticipantRepository) {
    this.participantRepo = participantRepo
  }

  public async isDuplicateEmailBy(participant: Participant): Promise<boolean> {
    const found = await this.participantRepo.getByEmail(participant.email)
    return found !== null
  }
}
