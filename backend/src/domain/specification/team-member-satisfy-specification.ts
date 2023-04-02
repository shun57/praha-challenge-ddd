import { Team } from "src/domain/entity/team/team"
import { IPairRepository } from "../interface/pair/repository-interface/pair-repository"

export class TeamMemberSatisfySpecification {
  private readonly teamLowerLimit = 3
  private pairRepo: IPairRepository
  public constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo
  }

  public async isSatisfiedBy(team: Team): Promise<boolean> {
    const pairs = await this.pairRepo.getByTeamId(team.teamId)
    const teamPairMembersLength = pairs.reduce((acc, pair) => acc + pair.participantIds.length, 0)
    return teamPairMembersLength >= this.teamLowerLimit
  }
}
