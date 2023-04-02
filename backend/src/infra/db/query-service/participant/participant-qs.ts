import { Injectable } from '@nestjs/common';
import { ParticipantDTO } from 'src/app/participant/dto/participant'
import { IParticipantQS } from 'src/domain/interface/participant/query-service-interface/participant-qs'
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class ParticipantQS implements IParticipantQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async getAll(): Promise<ParticipantDTO[]> {
    const participants = await this.prisma.participant.findMany()
    return participants.map(
      (participant) =>
        new ParticipantDTO({
          ...participant,
        }),
    )
  }
}
