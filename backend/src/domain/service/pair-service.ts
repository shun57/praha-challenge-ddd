import { Pair } from "src/domain/entity/pair/pair";
import { IPairRepository } from "../interface/pair/pair-repository";
import { PairName } from "../value-object/pair/pair-name";
import { ParticipantId } from "../value-object/participant/participant-id";
import { IPairQS } from "src/app/pair/query-service-interface/pair-qs";
import { NotFoundException } from "@nestjs/common";
import { Team } from "../entity/team/team";


export class PairService {
  private pairRepo: IPairRepository
  private pairQS: IPairQS
  public constructor(pairRepo: IPairRepository, pairQS: IPairQS) {
    this.pairRepo = pairRepo
    this.pairQS = pairQS
  }

  public async isSameTeamBy(participantIds: ParticipantId[]): Promise<boolean> {
    const pairs = await this.pairRepo.getByParticipantIds(participantIds)
    if (pairs.length === 0) {
      throw new Error("対象参加者がペアに所属していません。")
    }
    return pairs.every((pair) => pair.teamId == pairs[0]?.teamId)
  }

  public async getMinPairOfMinTeam(): Promise<Pair> {
    // 最少人数のペアを取得
    const minPairs = await this.pairQS.findMinPairsOfMinTeam()
    if (minPairs.length === 0) {
      throw new NotFoundException("最少人数のペアがありませんでした。")
    }
    // 最少人数が同じペアがあった場合ランダムに1ペア選択
    return minPairs[Math.floor(Math.random() * minPairs.length)]!
  }

  public async getMinPairByTeamWithoutCurrentPair(team: Team, filterPair: Pair): Promise<Pair | undefined> {
    let pairs = await this.pairRepo.getByTeamId(team.teamId)
    if (pairs.length === 0) {
      return undefined
    }
    // 対象ペアを抜く
    const updatedParticipant = pairs.filter((pair) => {
      return !pair.equals(filterPair)
    });
    pairs = updatedParticipant
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

  public async devidePair(pair: Pair, participantId: ParticipantId): Promise<[Pair, Pair]> {
    // ペアからランダムに1人減らす
    const removeParticipantId = pair.participantIds[Math.floor(Math.random() * pair.participantIds.length)]!
    pair.remove(removeParticipantId)
    // 新しいペアを作る
    const newPair = Pair.create({
      name: PairName.createRandomName(),
      teamId: pair.teamId,
      participantIds: [removeParticipantId, participantId]
    })
    return [pair, newPair]
  }
}
