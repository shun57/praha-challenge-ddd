import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id';
import { Entity } from 'src/shared/domain/entity'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'

interface ChallengeProps {
  title: string
  description: string
}

export class Challenge extends Entity<ChallengeProps> {

  get challengeId(): ChallengeId {
    return ChallengeId.create(this._id);
  }

  get title(): string {
    return this.props.title
  }

  get description(): string {
    return this.props.description
  }

  private constructor(props: ChallengeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: ChallengeProps, id?: UniqueEntityID): Challenge {
    const challenge = new Challenge({ ...props }, id)
    return challenge
  }
}
