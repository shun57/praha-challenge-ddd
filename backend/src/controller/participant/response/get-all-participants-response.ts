import { ParticipantDTO } from 'src/app/participant/dto/participant.dto'

export class GetAllParticipantsResponse {
  participants: { id: string; name: string, enrollementStatus: string }[]

  public constructor(participants: ParticipantDTO[]) {
    this.participants = participants.map(({ id, name, enrollementStatus }) => {
      return { id: id, name: name, enrollementStatus: enrollementStatus }
    })
  }
}

