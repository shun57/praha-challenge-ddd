import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service'
import { IParticipantRepository } from 'src/app/participant/repository-interface/participant-repository';
import { Participant } from 'src/domain/entity/participant/participant';

@Injectable()
export class ParticipantRepository implements IParticipantRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async save(participant: Participant): Promise<void> {
    await this.prisma.participant.create({
      data: {
        id: participant.participantId.id.toString(),
        name: participant.name.value,
        email: participant.email.value,
        enrollmentStatus: participant.enrollmentStatus.value,
      },
    })
  }
}
