import { ParticipantId } from "src/domain/value-object/participant/participant-id"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"


export class ParticipantIdsMapper {
  public static toEntity(participantIds: string[]): ParticipantId[] {
    const participantIdsEntity = participantIds.map((participantId) => {
      return ParticipantId.create(new UniqueEntityID(participantId))
    })
    return participantIdsEntity
  }

  public static toData(participantIds: ParticipantId[]): string[] {
    const participantIdsStr = participantIds.map((participantId) => {
      return participantId.id.toString()
    })
    return participantIdsStr
  }
}