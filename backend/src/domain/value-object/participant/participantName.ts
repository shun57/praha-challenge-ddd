import { ValueObject } from 'src/shared/domain/ValueObject'

export interface ParticipantNameProps {
    value: string;
}

export class ParticipantName extends ValueObject<ParticipantNameProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: ParticipantNameProps) {
        super(props);
    }
}