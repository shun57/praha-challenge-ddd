import { Participant } from "@prisma/client";
import { Pair } from "src/domain/entity/pair/pair";
import { PairName } from "src/domain/value-object/pair/pair-name";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { TeamId } from "src/domain/value-object/team/team-id";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";


export class PairMapper {
  public static toEntity(param: { id: string, name: string, teamId: string, participants: Participant[] }): Pair {
    const { id, name, teamId, participants } = param
    let participantIds: ParticipantId[] = []

    participants.map((participant) => {
      participantIds.push(ParticipantId.create(new UniqueEntityID(participant.id)))
    })

    const pairEntity = Pair.create({
      name: PairName.create({ value: name }),
      teamId: TeamId.create(new UniqueEntityID(teamId)),
      participantIds: participantIds
    }, new UniqueEntityID(id))

    return pairEntity
  }

  public static toData(pair: Pair): { id: string, name: string, teamId: string, participantIds: string[] } {
    let participantIds: string[] = []
    participantIds.map((participantId) => {
      participantIds.push(participantId)
    })
    return {
      id: pair.pairId.id.toString(),
      teamId: pair.teamId.id.toString(),
      name: pair.name.value,
      participantIds: participantIds
    }
  }
}