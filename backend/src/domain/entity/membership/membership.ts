import { Entity } from 'src/shared/domain/entity'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { TeamId } from 'src/domain/value-object/team/team-id'
import { MembershipId } from 'src/domain/value-object/membership/membership-id'
import { Participant } from '../participant/participant'

interface MembershipProps {
  participant: Participant
  pairId: PairId
  teamId: TeamId
}

export class Membership extends Entity<MembershipProps> {

  get membershipId(): MembershipId {
    return MembershipId.create(this._id);
  }

  get participant(): Participant {
    return this.props.participant
  }

  get pairId(): PairId {
    return this.props.pairId
  }

  get teamId(): TeamId {
    return this.props.teamId
  }

  private constructor(props: MembershipProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public changeTeam(teamId: TeamId) {
    this.props.teamId = teamId
  }

  public changePair(pairId: PairId) {
    this.props.pairId = pairId
  }

  public static isValidEnrollmentStatus(participant: Participant): boolean {
    return !participant.enrollmentStatus.isEnrolled()
  }

  public static create(props: MembershipProps, id?: UniqueEntityID): Membership {
    if (this.isValidEnrollmentStatus(props.participant)) {
      throw new Error("在籍中でない場合、チーム・ペアに所属できません。")
    }
    const membership = new Membership({ ...props }, id)
    return membership
  }
}
