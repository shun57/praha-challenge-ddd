import { Participant } from "src/domain/entity/participant/participant";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { CleanPrismaService } from "src/infra/db/prisma.service";

export interface IParticipantRepository {
  getById(participantId: ParticipantId): Promise<Participant | null>
  getByIds(participantIds: ParticipantId[]): Promise<Participant[]>
  getByEmail(email: ParticipantEmail): Promise<Participant | null>
  save(participant: Participant): Promise<Participant>
  saveInTransaction(participant: Participant, prisma: CleanPrismaService): Promise<Participant>
}