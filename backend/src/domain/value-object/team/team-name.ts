import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/shared/domain/value-object'

export interface TeamNameProps {
  value: string;
}

export class TeamName extends ValueObject<TeamNameProps> {

  get value(): string {
    return this.props.value;
  }

  private constructor(props: TeamNameProps) {
    super(props);
  }

  private static isNumber(name: string) {
    var re = /^[0-9]+$/;
    return re.test(name);
  }

  public static create(props: TeamNameProps): TeamName {
    if (props.value.length === 0) {
      throw new BadRequestException("チーム名は必須です");
    }
    if (!this.isNumber(props.value)) {
      throw new BadRequestException("チーム名は数字にしてください");
    }
    if (props.value.length > 3) {
      throw new BadRequestException("チーム名は3文字以下にしてください");
    }
    return new TeamName(props);
  }
}