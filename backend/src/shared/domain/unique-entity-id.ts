import { v4 as uuid_v4 } from "uuid";
import { Identifier } from 'src/shared/domain/identifier'

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : uuid_v4())
  }
}
