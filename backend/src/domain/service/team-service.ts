import { Team } from "../entity/team/team"
import { ITeamRepository } from "../interface/team/team-repository"


export class TeamService {
  private teamRepo: ITeamRepository
  public constructor(teamRepo: ITeamRepository) {
    this.teamRepo = teamRepo
  }

  public async getMinimumTeam(): Promise<Team | undefined> {
    const teams = await this.teamRepo.getAll()
    // 最少人数のチームを取得
    const minNumberOfPeople = teams.reduce(
      (min, team) =>
        team.numberOfParticipants() < min ? team.numberOfParticipants() : min,
      teams[0]!.numberOfParticipants(),
    )
    const minNumberOfMemberTeams = teams.filter((team) => team.numberOfParticipants() === minNumberOfPeople)
    // 最少人数が同じチームがあった場合ランダムに1チーム選択
    return minNumberOfMemberTeams[Math.floor(Math.random() * minNumberOfMemberTeams.length)]
  }
}
