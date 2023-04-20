import { IParticipantRepository } from "../interface/participant/participant-repository"
import { ParticipantId } from "../value-object/participant/participant-id"

export class CheckParticipantEnrollmentSpecification {
  private participantRepo: IParticipantRepository
  public constructor(
    participantRepo: IParticipantRepository,
  ) {
    this.participantRepo = participantRepo
  }

  public async isEnrolledIn(participantIds: ParticipantId[]): Promise<boolean> {
    const participants = await this.participantRepo.getByIds(participantIds)
    if (participants.length === 0) {
      return false
    }
    return participants.every((participant) => participant.enrollmentStatus.isEnrolled())
  }
}