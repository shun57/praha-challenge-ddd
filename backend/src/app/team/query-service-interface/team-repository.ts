import { TeamDTO } from "src/app/team/dto/team"

export interface TeamRepository {
  getAll(): Promise<TeamDTO[]>
}
