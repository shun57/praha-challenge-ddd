import { Participant } from "src/domain/entity/participant/participant";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";

export interface IParticipantRepository {
  getById(participantId: ParticipantId): Promise<Participant | null>
  getByEmail(email: ParticipantEmail): Promise<Participant | null>
  save(participant: Participant): Promise<Participant>
}