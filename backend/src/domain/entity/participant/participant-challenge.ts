import { Entity } from 'src/shared/domain/entity'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id'
import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id'
import { ParticipantChallengeProgress, ProgressType } from 'src/domain/value-object/participant/participant-challenge-progress'

interface ParticipantChallengeProps {
  participantId: ParticipantId
  challengeId: ChallengeId
  progress: ParticipantChallengeProgress
}

export class ParticipantChallenge extends Entity<ParticipantChallengeProps> {
  get participantId(): ParticipantId {
    return this.props.participantId;
  }

  get challengeId(): ChallengeId {
    return this.props.challengeId;
  }

  get progress(): ParticipantChallengeProgress {
    return this.props.progress;
  }

  public updateProgress(progress: ParticipantChallengeProgress): void {
    if (this.progress.value === ProgressType.completion) {
      throw new Error("進捗ステータスが完了の場合更新できません。")
    }
    this.props.progress = progress
  }

  private constructor(props: ParticipantChallengeProps) {
    super(props)
  }

  public static create(props: ParticipantChallengeProps): ParticipantChallenge {
    const participantChallenge = new ParticipantChallenge({ ...props })
    return participantChallenge
  }
}
