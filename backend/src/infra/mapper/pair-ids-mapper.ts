import { PairId } from "src/domain/value-object/pair/pair-id"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"


export class PairIdsMapper {
  public static toEntity(pairIds: string[]): PairId[] {
    let pairIdsEntity: PairId[] = []
    pairIds.map((pairId) => {
      pairIdsEntity.push(PairId.create(new UniqueEntityID(pairId)))
    })
    return pairIdsEntity
  }

  public static toData(pairIds: PairId[]): string[] {
    let pairIdsStr: string[] = []
    pairIds.map((pairId) => {
      pairIdsStr.push(pairId.id.toString())
    })
    return pairIdsStr
  }
}