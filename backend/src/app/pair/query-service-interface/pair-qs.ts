import { PairDTO } from "src/app/pair/dto/pair"

export interface IPairQS {
  getAll(): Promise<PairDTO[]>
}
