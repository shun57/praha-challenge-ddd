import { Entity } from 'src/shared/domain/entity'
import { TeamName } from 'src/domain/value-object/team/team-name'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { TeamId } from 'src/domain/value-object/team/team-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'

interface TeamProps {
  name: TeamName
  pairIds: PairId[]
  participantIds: ParticipantId[]
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

  get participantIds(): ParticipantId[] {
    return this.props.participantIds
  }

  private constructor(props: TeamProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public numberOfParticipants(): number {
    return this.props.participantIds.length
  }

  public removeParticipant(participantId: ParticipantId): void {
    const updatedParticipant = this.props.participantIds.filter((pid) => {
      return !pid.equals(participantId)
    });
    this.props.participantIds = updatedParticipant
  }

  public isBelowMinParticipants(): boolean {
    return this.numberOfParticipants() < TEAM_LOWER_LIMIT
  }

  public static isSatisfiedBy(participantIds: ParticipantId[]) {
    return participantIds.length >= TEAM_LOWER_LIMIT
  }

  public static create(props: TeamProps, id?: UniqueEntityID): Team {
    if (!this.isSatisfiedBy(props.participantIds)) {
      throw new Error("チームメンバーが足りていません。")
    }
    const team = new Team({ ...props }, id)
    return team
  }
}
