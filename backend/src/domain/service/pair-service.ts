import { Pair } from "src/domain/entity/pair/pair"
import { IPairRepository } from "../interface/pair/repository-interface/pair-repository"


export class PairService {
  private pairRepo: IPairRepository
  public constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo
  }

  public async isSameTeamBy(pair: Pair): Promise<boolean> {
    const pairs = await this.pairRepo.getByParticipantIds(pair.participantIds)
    if (pairs.length === 0) {
      throw new Error("対象参加者がペアに所属していません。")
    }
    return pairs.every((pair) => pair.teamId == pairs[0]?.teamId)
  }
}
