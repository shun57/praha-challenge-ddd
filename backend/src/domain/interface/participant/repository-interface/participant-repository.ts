import { Participant } from "src/domain/entity/participant/participant";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";

export interface IParticipantRepository {
  getByEmail(email: ParticipantEmail): Promise<Participant | null>
  save(participant: Participant): Promise<Participant>
}