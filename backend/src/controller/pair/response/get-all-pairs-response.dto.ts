import { Pair } from "src/domain/entity/pair/pair"


export class GetAllPairsResponse {
  pairs: PairDTO[]

  public constructor(params: { pairs: Pair[] }) {
    const { pairs } = params
    this.pairs = pairs.map((pair) => {
      return new PairDTO({
        id: pair.pairId.id.toString(),
        name: pair.name.value
      })
    })
  }
}

class PairDTO {
  id: string
  name: string

  public constructor(params: {
    id: string
    name: string
  }) {
    this.id = params.id
    this.name = params.name
  }
}