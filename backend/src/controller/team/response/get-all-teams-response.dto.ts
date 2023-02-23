import { TeamDTO } from 'src/app/team/dto/team'

export class GetAllTeamsResponse {
  teams: Team[]

  public constructor(params: { teams: TeamDTO[] }) {
    const { teams } = params
    this.teams = teams.map(({ id, name, }) => {
      return new Team({
        id,
        name,
      })
    })
  }
}

class Team {
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