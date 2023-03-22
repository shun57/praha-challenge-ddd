import { ParticipantDTO } from 'src/app/participant/dto/participant'

export class GetAllParticipantsResponse {
  participants: Participant[]

  public constructor(params: { participants: ParticipantDTO[] }) {
    const { participants } = params
    this.participants = participants.map(({ id, name, email }) => {
      return new Participant({
        id,
        name,
        email,
      })
    })
  }
}

class Participant {
  id: string
  name: string
  email: string

  public constructor(params: {
    id: string
    name: string
    email: string
  }) {
    this.id = params.id
    this.name = params.name
    this.email = params.email
  }
}