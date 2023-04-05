import { Team } from "src/domain/entity/team/team";
import { TeamId } from "src/domain/value-object/team/team-id";

export interface ITeamRepository {
  getById(teamId: TeamId): Promise<Team | null>
  getAll(): Promise<Team[]>
  save(team: Team): Promise<Team>
}