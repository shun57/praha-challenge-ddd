import { ParticipantDTO } from "src/app/participant/dto/participant"

export interface ParticipantRepository {
  getAll(): Promise<ParticipantDTO[]>
}
