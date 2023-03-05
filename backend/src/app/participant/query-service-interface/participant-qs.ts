import { ParticipantDTO } from "src/app/participant/dto/participant"

export interface ParticipantQS {
  getAll(): Promise<ParticipantDTO[]>
}
