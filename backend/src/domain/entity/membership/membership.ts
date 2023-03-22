import { Entity } from 'src/shared/domain/entity'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { TeamId } from 'src/domain/value-object/team/team-id'
import { MembershipEnrollmentStatus } from 'src/domain/value-object/membership/membership-enrollment-status'
import { MembershipId } from 'src/domain/value-object/membership/membership-id'

interface MembershipProps {
  participantId: ParticipantId
  pairId: PairId
  teamId: TeamId
  enrollmentStatus: MembershipEnrollmentStatus
}

export class Membership extends Entity<MembershipProps> {

  get membershipId(): MembershipId {
    return MembershipId.create(this._id);
  }

  get participantId(): ParticipantId {
    return this.props.participantId
  }

  get pairId(): PairId {
    return this.props.pairId
  }

  get teamId(): TeamId {
    return this.props.teamId
  }

  get enrollmentStatus(): MembershipEnrollmentStatus {
    return this.props.enrollmentStatus
  }

  private constructor(props: MembershipProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public changeTeamPair(pairId: PairId) {
    this.props.pairId = pairId
  }

  public changePairParticipant(participantId: ParticipantId) {
    this.props.participantId = participantId
  }

  public static create(props: MembershipProps, id?: UniqueEntityID): Membership {
    const membership = new Membership({ ...props }, id)
    return membership
  }
}
