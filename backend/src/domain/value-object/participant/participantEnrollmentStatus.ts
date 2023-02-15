import { ValueObject } from 'src/shared/domain/ValueObject'

export interface ParticipantEnrollmentStatusProps {
    value: string;
}

export const EnrollmentStatus = {
    enrolled: '在籍中',
    recess: '休会中',
    withdrawn: '退会済み',
} as const;

export type EnrollmentStatus = typeof EnrollmentStatus[keyof typeof EnrollmentStatus]

export class ParticipantEnrollmentStatus extends ValueObject<ParticipantEnrollmentStatusProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: ParticipantEnrollmentStatusProps) {
        super(props);
    }

    public static create(props: ParticipantEnrollmentStatusProps): ParticipantEnrollmentStatus {
        const statusList = Object.values(EnrollmentStatus);
        if (!statusList.find((status: EnrollmentStatus) => status === props.value)) {
            throw new Error('在籍ステータスが誤っています。');
        }
        return new ParticipantEnrollmentStatus(props);
    }
}