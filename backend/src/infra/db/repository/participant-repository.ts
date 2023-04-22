import { Injectable } from '@nestjs/common';
import { CleanPrismaService, PrismaService } from 'src/infra/db/prisma.service'
import { IParticipantRepository } from 'src/domain/interface/participant/participant-repository';
import { Participant } from 'src/domain/entity/participant/participant';
import { ParticipantEmail } from 'src/domain/value-object/participant/participant-email';
import { ParticipantMapper } from 'src/infra/mapper/participant-mapper';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async getById(participantId: ParticipantId): Promise<Participant | null> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        id: participantId.id.toString()
      }
    })
    if (participant === null) {
      return null
    }
    return ParticipantMapper.toEntity({ id: participant.id, name: participant.name, email: participant.email, enrollmentStatus: participant.enrollmentStatus })
  }

  public async getByIds(participantIds: ParticipantId[]): Promise<Participant[]> {
    let participantIdsStr: string[] = []
    participantIds.map((participantId) => {
      participantIdsStr.push(participantId.id.toString())
    })
    const participants = await this.prisma.participant.findMany({
      where: {
        id: {
          in: participantIdsStr
        }
      }
    })
    // Entityに変換
    let participantEntities: Participant[] = []
    participants.map((participant) => {
      participantEntities.push(ParticipantMapper.toEntity({ id: participant.id, name: participant.name, email: participant.email, enrollmentStatus: participant.enrollmentStatus }))
    })
    return participantEntities
  }

  public async getByEmail(email: ParticipantEmail): Promise<Participant | null> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        email: email.value
      }
    })
    if (participant === null) {
      return null
    }
    return ParticipantMapper.toEntity({ id: participant.id, name: participant.name, email: participant.email, enrollmentStatus: participant.enrollmentStatus })
  }

  public async save(participant: Participant): Promise<Participant> {
    await this.prisma.participant.upsert({
      where: {
        id: participant.participantId.id.toString()
      },
      create: {
        id: participant.participantId.id.toString(),
        name: participant.name.value,
        email: participant.email.value,
        enrollmentStatus: participant.enrollmentStatus.value
      },
      update: {
        email: participant.email.value,
        enrollmentStatus: participant.enrollmentStatus.value
      }
    })
    return participant
  }

  public async saveInTransaction(participant: Participant, prisma: CleanPrismaService): Promise<Participant> {
    await prisma.participant.upsert({
      where: {
        id: participant.participantId.id.toString()
      },
      create: {
        id: participant.participantId.id.toString(),
        name: participant.name.value,
        email: participant.email.value,
        enrollmentStatus: participant.enrollmentStatus.value
      },
      update: {
        email: participant.email.value,
        enrollmentStatus: participant.enrollmentStatus.value
      }
    })
    return participant
  }
}
