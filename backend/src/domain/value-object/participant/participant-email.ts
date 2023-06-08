import { BadRequestException } from '@nestjs/common';
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

  private static isValidEmail(email: string): boolean {
    const emailRegex: RegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  public static create(props: ParticipantEmailProps): ParticipantEmail {
    if (!this.isValidEmail(props.value)) {
      throw new BadRequestException("メールアドレス形式ではありません");
    }
    return new ParticipantEmail(props);
  }
}