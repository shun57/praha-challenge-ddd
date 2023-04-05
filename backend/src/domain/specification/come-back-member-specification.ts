import { Pair } from 'src/domain/entity/pair/pair'
import { ITeamRepository } from '../interface/team/team-repository'
import { IPairRepository } from '../interface/pair/pair-repository'
import { Team } from 'src/domain/entity/team/team'
import { PairName } from '../value-object/pair/pair-name'
import { ParticipantId } from '../value-object/participant/participant-id'

export class ComeBackMemberSpecification {
  private teamRepo: ITeamRepository
  private pairRepo: IPairRepository
  public constructor(teamRepo: ITeamRepository, pairRepo: IPairRepository) {
    this.teamRepo = teamRepo
    this.pairRepo = pairRepo
  }

  public async getMinimumTeamToJoin(): Promise<Team | undefined> {
    const teams = await this.teamRepo.getAll()
    const pairs = await this.pairRepo.getAll()
    // 最少人数のチームを取得
    const minTeams = teams.reduce((min: { team: Team[], numberOfTeamMembers: number }, team) => {
      const teamPairs = team.pairIds.map(pairId => pairs.find(pair => pair.pairId === pairId))
      const numberOfTeamMembers = teamPairs.reduce((acc, pair) => acc + pair!.participantIds.length, 0)
      if (numberOfTeamMembers < min.numberOfTeamMembers) {
        return { team: [team], numberOfTeamMembers }
      } else if (numberOfTeamMembers === min.numberOfTeamMembers) {
        min.team.push(team)
      }
      return min
    }, { team: [], numberOfTeamMembers: Number.MAX_SAFE_INTEGER })

    // 最少人数が同じチームがあった場合ランダムに1チーム選択
    return this.randomChoice(minTeams.team)
  }

  public async getMinimumPairToJoin(team: Team): Promise<Pair | undefined> {
    const pairs = await this.pairRepo.getByTeamId(team.teamId)
    // 最少人数を取得
    const minNumberOfPeople = pairs.reduce(
      (min, pair) =>
        pair.numberOfParticipants() < min ? pair.numberOfParticipants() : min,
      pairs[0]!.numberOfParticipants(),
    )
    // 最少人数のペアを取得
    const minNumberOfMemberPair = pairs.filter((pair) => pair.numberOfParticipants() === minNumberOfPeople)
    // 最少人数が同じペアがあった場合ランダムに1ペア選択
    return this.randomChoice(minNumberOfMemberPair)
  }

  public async devidePairIfOverMember(pair: Pair, participantId: ParticipantId): Promise<Pair | null> {
    // ペアが最大人数だった場合、新しいペアを作る
    if (pair.isMaxParticipants()) {
      // ペアからランダムに1人減らす
      const removeParticipantId = this.randomChoice(pair.participantIds)
      pair.remove(removeParticipantId!)
      await this.pairRepo.save(pair)
      // 新しいペアを作る
      const pairs = await this.pairRepo.getAll()
      // ペアの名前が被らないようにする
      const newPairName = this.getRandomPairNameNotIn(pairs)
      const newPair = Pair.create({
        name: newPairName,
        teamId: pair.teamId,
        participantIds: [removeParticipantId!, participantId]
      })
      await this.pairRepo.save(newPair)
      return newPair
    }
    return null
  }

  private getRandomPairNameNotIn(pairs: Pair[]): PairName {
    let randomPairName: string;
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    do {
      randomPairName = alphabet[Math.floor(Math.random() * alphabet.length)]!;
    } while (pairs.some(pair => {
      return pair.name.value !== randomPairName
    }));
    return PairName.create({ value: randomPairName });
  }

  private randomChoice<T>(list: T[]) {
    return list[Math.floor(Math.random() * list.length)];
  }
}
