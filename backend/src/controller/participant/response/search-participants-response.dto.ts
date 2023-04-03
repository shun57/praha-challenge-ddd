import { ParticipantDTO } from 'src/app/participant/dto/participant'

export class SearchParticipantsResponse {
  participants: Participant[]

  public constructor(params: { participants: Page<ParticipantDTO> }) {
    const { participants } = params
    this.participants = participants.items.map(({ id, name, email, enrollmentStatus }) => {
      return new Participant({
        id,
        name,
        email,
        enrollmentStatus,
      })
    })
  }
}

class Participant {
  id: string
  name: string
  email: string
  enrollmentStatus: string

  public constructor(params: {
    id: string
    name: string
    email: string
    enrollmentStatus: string
  }) {
    this.id = params.id
    this.name = params.name
    this.email = params.email
    this.enrollmentStatus = params.enrollmentStatus
  }
}