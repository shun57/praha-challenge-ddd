import { PairDTO } from 'src/app/pair/dto/pair'

export class GetAllPairsResponse {
  pairs: Pair[]

  public constructor(params: { pairs: PairDTO[] }) {
    const { pairs } = params
    this.pairs = pairs.map(({ id, name, }) => {
      return new Pair({
        id,
        name,
      })
    })
  }
}

class Pair {
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