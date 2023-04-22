import { Pair } from "src/domain/entity/pair/pair";
import { CleanPrismaService } from "src/infra/db/prisma.service";
import { Team } from "../entity/team/team";
import { IPairRepository } from "../interface/pair/pair-repository";
import { PairName } from "../value-object/pair/pair-name";
import { ParticipantId } from "../value-object/participant/participant-id";


export class PairService {
  private pairRepo: IPairRepository
  public constructor(pairRepo: IPairRepository) {
    this.pairRepo = pairRepo
  }

  public async isSameTeamBy(participantIds: ParticipantId[]): Promise<boolean> {
    const pairs = await this.pairRepo.getByParticipantIds(participantIds)
    if (pairs.length === 0) {
      throw new Error("対象参加者がペアに所属していません。")
    }
    return pairs.every((pair) => pair.teamId == pairs[0]?.teamId)
  }

  public async getMinimumPairBy(team: Team, filterPair: Pair | undefined = undefined): Promise<Pair | undefined> {
    let pairs = await this.pairRepo.getByTeamId(team.teamId)
    if (pairs.length === 0) {
      return undefined
    }
    // ペアが渡された場合は対象ペアを抜く
    if (filterPair != undefined) {
      const updatedParticipant = pairs.filter((pair) => {
        return !pair.equals(filterPair)
      });
      pairs = updatedParticipant
    }
    // 最少人数を取得
    const minNumberOfPeople = pairs.reduce(
      (min, pair) =>
        pair.numberOfParticipants() < min ? pair.numberOfParticipants() : min,
      pairs[0]!.numberOfParticipants(),
    )
    // 最少人数のペアを取得
    const minNumberOfMemberPair = pairs.filter((pair) => pair.numberOfParticipants() === minNumberOfPeople)
    // 最少人数が同じペアがあった場合ランダムに1ペア選択
    return minNumberOfMemberPair[Math.floor(Math.random() * minNumberOfMemberPair.length)]
  }

  public async devidePairIfOverMember(pair: Pair, participantId: ParticipantId, prisma: CleanPrismaService): Promise<void> {
    // ペアからランダムに1人減らす
    const removeParticipantId = pair.participantIds[Math.floor(Math.random() * pair.participantIds.length)]
    pair.remove(removeParticipantId!)
    // 新しいペアを作る
    const newPair = Pair.create({
      name: PairName.createRandomName(),
      teamId: pair.teamId,
      participantIds: [removeParticipantId!, participantId]
    })

    await this.pairRepo.saveInTransaction(pair, prisma)
    await this.pairRepo.saveInTransaction(newPair, prisma)
  }
}
