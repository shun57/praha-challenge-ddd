import { uuid } from 'uuidv4'
import { Identifier } from 'src/shared/domain/identifier'

export class UniqueEntityID extends Identifier<string | number> {
  constructor(id?: string | number) {
    super(id ? id : uuid())
  }
}
