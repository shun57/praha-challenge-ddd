import { ValueObject } from 'src/shared/domain/value-object'

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

  public static create(props: ParticipantEmailProps): ParticipantEmail {
    return new ParticipantEmail(props);
  }
}