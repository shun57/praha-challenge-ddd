import { PairMember } from "src/domain/entity/pair-member/pair-member";
import { PairId } from "src/domain/value-object/pair/pair-id";


export interface IPairMemberRepository {
  getByPairIds(pairIds: PairId[]): Promise<PairMember[]>
}