import { PairMember } from "src/domain/entity/pair-member/pair-member"
import { PairId } from "src/domain/value-object/pair/pair-id"
import { ParticipantId } from "src/domain/value-object/participant/participant-id"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"


export class PairMemberMapper {
  public static toEntity(param: { id: string, pairId: string, participantId: string }): PairMember {
    const { id, pairId, participantId } = param

    const pairMemberEntity = PairMember.create({
      pairId: PairId.create(new UniqueEntityID(pairId)),
      participantId: ParticipantId.create(new UniqueEntityID(participantId))
    }, new UniqueEntityID(id))

    return pairMemberEntity
  }

  public static toData(pairMember: PairMember): { id: string, pairId: string, participantId: string } {
    return {
      id: pairMember.pairMemberId.toString(),
      pairId: pairMember.pairId.id.toString(),
      participantId: pairMember.participantId.id.toString(),
    }
  }
}