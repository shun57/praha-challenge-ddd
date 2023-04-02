import { ParticipantDTO } from "src/app/participant/dto/participant"

export interface IParticipantQS {
  getAll(): Promise<ParticipantDTO[]>
}
