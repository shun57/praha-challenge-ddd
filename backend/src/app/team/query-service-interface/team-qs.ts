import { TeamDTO } from "src/app/team/dto/team"

export interface TeamQS {
  getAll(): Promise<TeamDTO[]>
}
