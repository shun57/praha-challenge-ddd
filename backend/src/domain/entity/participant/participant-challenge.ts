import { Entity } from 'src/shared/domain/entity'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'
import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id'
import { ParticipantChallengeProgress, ProgressType } from 'src/domain/value-object/participant/participant-challenge-progress'

interface ParticipantChallengeProps {
  participantId: ParticipantId
  challengeId: ChallengeId
  progress: ParticipantChallengeProgress
}

export class ParticipantChallenge extends Entity<ParticipantChallengeProps> {

  get id(): UniqueEntityID {
    return this._id;
  }

  get participantId(): ParticipantId {
    return this.props.participantId;
  }

  get challengeId(): ChallengeId {
    return this.props.challengeId;
  }

  get progress(): ParticipantChallengeProgress {
    return this.props.progress;
  }

  public isCompletion(): boolean {
    return this.props.progress.value === ProgressType.completion;
  }

  private constructor(props: ParticipantChallengeProps, id?: UniqueEntityID) {
    super(props, id)
  }

  public static create(props: ParticipantChallengeProps, id?: UniqueEntityID): ParticipantChallenge {
    const participant = new ParticipantChallenge({ ...props }, id)
    return participant
  }
}
