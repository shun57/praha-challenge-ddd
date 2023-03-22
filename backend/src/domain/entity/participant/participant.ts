import { Entity } from 'src/shared/domain/entity'
import { ParticipantName } from 'src/domain/value-object/participant/participant-name'
import { ParticipantEmail } from 'src/domain/value-object/participant/participant-email'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'

interface ParticipantProps {
  name: ParticipantName
  email: ParticipantEmail
}

export class Participant extends Entity<ParticipantProps> {

  get participantId(): ParticipantId {
    return ParticipantId.create(this._id);
  }

  get name(): ParticipantName {
    return this.props.name
  }

  get email(): ParticipantEmail {
    return this.props.email
  }

  private constructor(props: ParticipantProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: ParticipantProps, id?: UniqueEntityID): Participant {
    const participant = new Participant({ ...props }, id)
    return participant
  }
}
