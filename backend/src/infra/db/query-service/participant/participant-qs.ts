import { Injectable } from '@nestjs/common';
import { ParticipantDTO } from 'src/app/participant/dto/participant'
import { IParticipantQS } from 'src/domain/interface/participant/query-service-interface/participant-qs'
import { ParticipantEmail } from 'src/domain/value-object/participant/participant-email';
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class ParticipantQS implements IParticipantQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async getAll(): Promise<ParticipantDTO[]> {
    const allParticipants = await this.prisma.participant.findMany()
    return allParticipants.map(
      (participant) =>
        new ParticipantDTO({
          ...participant,
        }),
    )
  }

  public async isExist(email: ParticipantEmail): Promise<boolean> {
    const participant = await this.prisma.participant.findUnique({
      where: {
        email: email.value
      }
    })
    return participant !== null
  }
}
