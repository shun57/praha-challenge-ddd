import { Pair, PairMember } from "@prisma/client";
import { Team } from "src/domain/entity/team/team";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { PairName } from "src/domain/value-object/pair/pair-name";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";


export class TeamMapper {
  public static toEntity(param: { id: string, name: string, pairs: Pair[] }): Team {
    const { id, name, pairs } = param
    let pairIds: PairId[] = []
    // let participantIds: ParticipantId[] = []

    pairs.map((pair) => {
      pairIds.push(PairId.create(new UniqueEntityID(pair.id)))
    })
    // ペアに含まれる全参加者を取得
    // pairsMembers.map((pairMembers) => {
    //   pairMembers.map((pairMember) => {
    //     participantIds.push(ParticipantId.create(new UniqueEntityID(pairMember.participantId)))
    //   })
    // })

    const TeamEntity = Team.create({
      name: PairName.create({ value: name }),
      pairIds: pairIds,
      // participantIds: participantIds
    }, new UniqueEntityID(id))

    return TeamEntity
  }

  public static toData(team: Team): { id: string, name: string, pairIds: string[] } {
    let pairIds: string[] = []
    team.pairIds.map((pairId) => {
      pairIds.push(pairId.id.toString())
    })
    return {
      id: team.teamId.id.toString(),
      name: team.name.value,
      pairIds: pairIds
    }
  }
}