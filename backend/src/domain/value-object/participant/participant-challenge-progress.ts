import { ValueObject } from 'src/shared/domain/value-object'

export interface ParticipantChallengeProgressProps {
  value: string;
}

export const ProgressType = {
  untouched: '未着手',
  waitingReview: 'レビュー待ち',
  completion: '完了',
} as const;

export type ProgressType = typeof ProgressType[keyof typeof ProgressType]

export class ParticipantChallengeProgress extends ValueObject<ParticipantChallengeProgressProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ParticipantChallengeProgressProps) {
    super(props);
  }

  public static create(props: ParticipantChallengeProgressProps): ParticipantChallengeProgress {
    const progressList = Object.values(ProgressType);
    if (!progressList.find((progress: ProgressType) => progress === props.value)) {
      throw new Error('進捗ステータスが誤っています。');
    }
    return new ParticipantChallengeProgress(props);
  }
}