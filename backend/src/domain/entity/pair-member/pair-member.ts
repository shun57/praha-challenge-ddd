import { Entity } from 'src/shared/domain/entity'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { PairMemberId } from 'src/domain/value-object/pair-member/pair-member-id'

interface PairMemberProps {
  participantId: ParticipantId
  pairId: PairId
}

export class PairMember extends Entity<PairMemberProps> {
  get pairMemberId(): PairMemberId {
    return PairMemberId.create(this._id)
  }

  get participantId(): ParticipantId {
    return this.props.participantId
  }

  get pairId(): PairId {
    return this.props.pairId
  }

  private constructor(props: PairMemberProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: PairMemberProps, id?: UniqueEntityID): PairMember {
    const pair = new PairMember({ ...props }, id)
    return pair
  }
}
