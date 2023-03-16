import { Participant } from "src/domain/entity/participant/participant";

export interface IParticipantRepository {
  save(participant: Participant): Promise<void>
}