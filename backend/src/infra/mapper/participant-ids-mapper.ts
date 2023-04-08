import { ParticipantId } from "src/domain/value-object/participant/participant-id"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"


export class ParticipantIdsMapper {
  public static toEntity(participantIds: string[]): ParticipantId[] {
    let participantIdsEntity: ParticipantId[] = []
    participantIds.map((participantId) => {
      participantIdsEntity.push(ParticipantId.create(new UniqueEntityID(participantId)))
    })
    return participantIdsEntity
  }
}