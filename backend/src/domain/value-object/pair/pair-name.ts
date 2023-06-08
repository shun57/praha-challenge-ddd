import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/shared/domain/value-object'

export interface PairNameProps {
  value: string;
}

export class PairName extends ValueObject<PairNameProps> {
  private static nameLength: number = 1;

  get value(): string {
    return this.props.value;
  }

  private constructor(props: PairNameProps) {
    super(props);
  }

  public static createRandomName(): PairName {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomPairName = alphabet[Math.floor(Math.random() * alphabet.length)]!;
    return PairName.create({ value: randomPairName });
  }

  private static isAlphabet(name: string) {
    var re = /^[a-zA-Z]+$/;
    return re.test(name);
  }

  public static create(props: PairNameProps): PairName {
    if (props.value.length !== this.nameLength) {
      throw new BadRequestException("ペア名は1文字にしてください");
    }
    if (!this.isAlphabet(props.value)) {
      throw new BadRequestException("ペア名は英文字にしてください");
    }

    return new PairName(props);
  }
}