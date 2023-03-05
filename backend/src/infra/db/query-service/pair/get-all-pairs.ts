import { Injectable } from '@nestjs/common';
import { PairDTO } from 'src/app/pair/dto/pair'
import { PairQS } from 'src/app/pair/query-service-interface/pair-qs'
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class GetAllPairs implements PairQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async getAll(): Promise<PairDTO[]> {
    const allParticipants = await this.prisma.pair.findMany()
    return allParticipants.map(
      (pair) =>
        new PairDTO({
          ...pair,
        }),
    )
  }
}
