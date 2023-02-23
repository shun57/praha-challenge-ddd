import { Entity } from 'src/shared/domain/entity'
import { TeamName } from 'src/domain/value-object/team/team-name'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'

interface TeamProps {
  name: TeamName
}

export class Team extends Entity<TeamProps> {

  get name(): TeamName {
    return this.props.name
  }

  private constructor(props: TeamProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: TeamProps, id?: UniqueEntityID): Team {
    const team = new Team({ ...props }, id)
    return team
  }
}
