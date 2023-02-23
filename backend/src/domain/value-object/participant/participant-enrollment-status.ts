import { ValueObject } from 'src/shared/domain/value-object'

export interface ParticipantEnrollmentStatusProps {
  value: string;
}

export const EnrollmentStatusType = {
  enrolled: '在籍中',
  recess: '休会中',
  withdrawn: '退会済み',
} as const;

export type EnrollmentStatusType = typeof EnrollmentStatusType[keyof typeof EnrollmentStatusType]

export class ParticipantEnrollmentStatus extends ValueObject<ParticipantEnrollmentStatusProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: ParticipantEnrollmentStatusProps) {
    super(props);
  }

  public static create(props: ParticipantEnrollmentStatusProps): ParticipantEnrollmentStatus {
    const statusList = Object.values(EnrollmentStatusType);
    if (!statusList.find((status: EnrollmentStatusType) => status === props.value)) {
      throw new Error('在籍ステータスが誤っています。');
    }
    return new ParticipantEnrollmentStatus(props);
  }
}