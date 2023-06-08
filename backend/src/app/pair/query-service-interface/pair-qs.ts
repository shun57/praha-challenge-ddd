import { Pair } from "src/domain/entity/pair/pair";


export interface IPairQS {
  findMinPairsOfMinTeam(): Promise<Pair[]>
}
