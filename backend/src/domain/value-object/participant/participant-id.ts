import { Entity } from 'src/shared/domain/entity'
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id'

export class ParticipantId extends Entity<any> {

  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id)
  }

  public static create(id?: UniqueEntityID): ParticipantId {
    return new ParticipantId(id);
  }
}