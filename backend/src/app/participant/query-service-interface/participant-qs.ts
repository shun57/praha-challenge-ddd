import { ParticipantDTO } from "src/app/participant/dto/participant"
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email"

export interface IParticipantQS {
  isExist(email: ParticipantEmail): Promise<boolean>
  getAll(): Promise<ParticipantDTO[]>
}
