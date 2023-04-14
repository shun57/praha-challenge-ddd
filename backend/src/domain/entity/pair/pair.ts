import { Entity } from 'src/shared/domain/entity'
import { PairName } from 'src/domain/value-object/pair/pair-name'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'
import { PairId } from 'src/domain/value-object/pair/pair-id'
import { TeamId } from 'src/domain/value-object/team/team-id'

interface PairProps {
  name: PairName
  teamId: TeamId
  participantIds: ParticipantId[]
}

const PAIR_UPPER_LIMIT = 3
const PAIR_LOWER_LIMIT = 2

export class Pair extends Entity<PairProps> {

  get pairId(): PairId {
    return PairId.create(this._id)
  }

  get name(): PairName {
    return this.props.name
  }

  get teamId(): TeamId {
    return this.props.teamId
  }

  get participantIds(): ParticipantId[] {
    return this.props.participantIds
  }

  private constructor(props: PairProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public join(participantId: ParticipantId): void {
    this.props.participantIds.push(participantId)
  }

  public remove(participantId: ParticipantId): void {
    const index = this.props.participantIds.indexOf(participantId);
    this.props.participantIds.splice(index, 1)
  }

  public numberOfParticipants(): number {
    return this.props.participantIds.length
  }

  public isMaxParticipants(): boolean {
    return this.numberOfParticipants() === PAIR_UPPER_LIMIT
  }

  public isMinParticipants(): boolean {
    return this.numberOfParticipants() < PAIR_LOWER_LIMIT
  }

  public static isValidNumberOfParticipants(participantIds: ParticipantId[]): boolean {
    return (participantIds.length < PAIR_LOWER_LIMIT || participantIds.length > PAIR_UPPER_LIMIT)
  }

  public static create(props: PairProps, id?: UniqueEntityID): Pair {
    if (this.isValidNumberOfParticipants(props.participantIds)) {
      throw new Error("ペアに所属できる参加者人数は" + PAIR_LOWER_LIMIT + "〜" + PAIR_UPPER_LIMIT + "名です")
    }
    const pair = new Pair({ ...props }, id)
    return pair
  }
}
