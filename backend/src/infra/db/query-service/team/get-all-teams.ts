import { Injectable } from '@nestjs/common';
import { TeamDTO } from 'src/app/team/dto/team'
import { TeamQS } from 'src/app/team/query-service-interface/team-qs'
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class GetAllTeams implements TeamQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async getAll(): Promise<TeamDTO[]> {
    const allParticipants = await this.prisma.team.findMany()
    return allParticipants.map(
      (team) =>
        new TeamDTO({
          ...team,
        }),
    )
  }
}
