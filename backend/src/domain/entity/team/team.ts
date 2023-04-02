import { Entity } from 'src/shared/domain/entity'
import { TeamName } from 'src/domain/value-object/team/team-name'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { TeamId } from 'src/domain/value-object/team/team-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'

interface TeamProps {
  name: TeamName
  pairIds: PairId[]
  // participantIds: ParticipantId[]
}

const TEAM_LOWER_LIMIT = 3

export class Team extends Entity<TeamProps> {

  get teamId(): TeamId {
    return TeamId.create(this._id);
  }

  get name(): TeamName {
    return this.props.name
  }

  get pairIds(): PairId[] {
    return this.props.pairIds
  }

  // get participantIds(): ParticipantId[] {
  //   return this.props.participantIds
  // }

  private constructor(props: TeamProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public changePairs(newPairIds: PairId[]) {
    this.props.pairIds = newPairIds
  }

  public removePair(pairId: PairId): void {
    const index = this.props.pairIds.indexOf(pairId);
    this.props.pairIds.splice(index, 1)
  }

  // public removeMember(membershipId: ParticipantId): void {
  //   const index = this.props.participantIds.indexOf(membershipId);
  //   this.props.participantIds.splice(index, 1)
  // }

  // public countMemberships(): number {
  //   return this.props.participantIds.length
  // }

  // public isSatisfiedMembers(): boolean {
  //   return this.countMemberships() >= TEAM_LOWER_LIMIT
  // }

  public static isValidNumberOfMembers(participantIds: ParticipantId[]) {
    return participantIds.length < TEAM_LOWER_LIMIT
  }

  public static create(props: TeamProps, id?: UniqueEntityID): Team {
    // if (this.isValidNumberOfMembers(props.participantIds)) {
    //   throw new Error("会員数がチーム作成ルールを満たしていません")
    // }
    const team = new Team({ ...props }, id)
    return team
  }
}
