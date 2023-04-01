import { Entity } from 'src/shared/domain/entity'
import { ParticipantName } from 'src/domain/value-object/participant/participant-name'
import { ParticipantEmail } from 'src/domain/value-object/participant/participant-email'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from 'src/domain/value-object/participant/participant-enrollment-status'

interface ParticipantProps {
  name: ParticipantName
  email: ParticipantEmail
  enrollmentStatus: ParticipantEnrollmentStatus
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

  get enrollmentStatus(): ParticipantEnrollmentStatus {
    return this.props.enrollmentStatus
  }

  private constructor(props: ParticipantProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public updateEnrollmentStatus(newEnrollmentStatus: ParticipantEnrollmentStatus) {
    this.props.enrollmentStatus = newEnrollmentStatus
  }

  public isComeback(newEnrollmentStatus: ParticipantEnrollmentStatus) {
    return !this.props.enrollmentStatus.isEnrolled() && newEnrollmentStatus.isEnrolled()
  }

  public isSecession(newEnrollmentStatus: ParticipantEnrollmentStatus) {
    return this.props.enrollmentStatus.isEnrolled() && !newEnrollmentStatus.isEnrolled()
  }

  public static create(props: ParticipantProps, id?: UniqueEntityID): Participant {
    const participant = new Participant({ ...props }, id)
    return participant
  }
}
