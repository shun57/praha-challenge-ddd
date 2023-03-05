import { PairDTO } from "src/app/pair/dto/pair"

export interface PairQS {
  getAll(): Promise<PairDTO[]>
}
