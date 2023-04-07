import { Team } from "src/domain/entity/team/team"


export class GetAllTeamsResponse {
  teams: TeamDTO[]

  public constructor(params: { teams: Team[] }) {
    const { teams } = params
    this.teams = teams.map((team) => {
      return new TeamDTO({
        id: team.teamId.id.toString(),
        name: team.name.value
      })
    })
  }
}

class TeamDTO {
  id: string
  name: string

  public constructor(params: {
    id: string
    name: string
  }) {
    this.id = params.id
    this.name = params.name
  }
}