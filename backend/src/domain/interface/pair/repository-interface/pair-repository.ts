import { Pair } from "src/domain/entity/pair/pair";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { TeamId } from "src/domain/value-object/team/team-id";

export interface IPairRepository {
  getAll(): Promise<Pair[]>
  getById(pairId: PairId): Promise<Pair | null>
  getByIds(pairId: PairId[]): Promise<Pair[]>
  getByParticipantIds(participantIds: ParticipantId[]): Promise<Pair[]>
  save(pair: Pair): Promise<Pair>
}