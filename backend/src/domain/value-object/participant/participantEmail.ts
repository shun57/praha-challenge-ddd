import { ValueObject } from 'src/shared/domain/ValueObject'

export interface ParticipantEmailProps {
    value: string;
}

export class ParticipantEmail extends ValueObject<ParticipantEmailProps> {

    get value(): string {
        return this.props.value;
    }

    private constructor(props: ParticipantEmailProps) {
        super(props);
    }
}