import { Entity } from 'src/shared/domain/entity'
import { PairName } from 'src/domain/value-object/pair/pair-name'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'

interface PairProps {
  name: PairName
}

export class Pair extends Entity<PairProps> {

  get name(): PairName {
    return this.props.name
  }

  private constructor(props: PairProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: PairProps, id?: UniqueEntityID): Pair {
    const pair = new Pair({ ...props }, id)
    return pair
  }
}
