import { ValueObject } from 'src/shared/domain/value-object'

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

  public static create(props: ParticipantNameProps): ParticipantName {
    return new ParticipantName(props);
  }
}