import { TeamDTO } from "src/app/team/dto/team"

export interface ITeamQS {
  getAll(): Promise<TeamDTO[]>
}
