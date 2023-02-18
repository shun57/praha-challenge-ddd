import { ParticipantDTO } from "src/app/participant/dto/participant.dto"

export interface ParticipantRepository {
  getAll(): Promise<ParticipantDTO[]>
}
