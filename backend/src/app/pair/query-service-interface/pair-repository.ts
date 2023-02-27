import { PairDTO } from "src/app/pair/dto/pair"

export interface PairRepository {
  getAll(): Promise<PairDTO[]>
}
