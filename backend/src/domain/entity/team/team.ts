import { Entity } from 'src/shared/domain/entity'
import { TeamName } from 'src/domain/value-object/team/team-name'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { TeamId } from 'src/domain/value-object/team/team-id'

interface TeamProps {
  name: TeamName
  pairIds: PairId[]
}

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

  public static create(props: TeamProps, id?: UniqueEntityID): Team {
    const team = new Team({ ...props }, id)
    return team
  }
}
