import { Pair } from "src/domain/entity/pair/pair";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { TeamId } from "src/domain/value-object/team/team-id";
import { CleanPrismaService } from "src/infra/db/prisma.service";

export interface IPairRepository {
  getAll(): Promise<Pair[]>
  getById(pairId: PairId): Promise<Pair | null>
  getByIds(pairIds: PairId[]): Promise<Pair[]>
  getByTeamId(teamId: TeamId): Promise<Pair[]>
  getByParticipantId(participantId: ParticipantId): Promise<Pair | null>
  getByParticipantIds(participantIds: ParticipantId[]): Promise<Pair[]>
  save(pair: Pair): Promise<Pair>
  saveInTransaction(pair: Pair, prisma: CleanPrismaService): Promise<Pair>
}