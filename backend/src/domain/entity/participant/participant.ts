import { Entity } from 'src/shared/domain/Entity'
import { ParticipantName } from 'src/domain/value-object/participant/participantName'
import { ParticipantEmail } from 'src/domain/value-object/participant/participantEmail'
import { ParticipantEnrollmentStatus } from 'src/domain/value-object/participant/participantEnrollmentStatus'
import { UniqueEntityID } from 'src/shared/domain/uniqueEntityID'

interface ParticipantProps {
  name: ParticipantName
  email: ParticipantEmail
  enrollmentStatus: ParticipantEnrollmentStatus
}

export class Participant extends Entity<ParticipantProps> {

  get name(): ParticipantName {
    return this.props.name
  }

  get email(): ParticipantEmail {
    return this.props.email
  }

  get enrollmentStatus(): ParticipantEnrollmentStatus {
    return this.props.enrollmentStatus
  }

  private constructor(props: ParticipantProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: ParticipantProps, id?: UniqueEntityID): Participant {
    const participant = new Participant({ ...props }, id)
    return participant
  }
}
