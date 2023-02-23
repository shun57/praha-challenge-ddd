import { Injectable } from '@nestjs/common';
import { TeamDTO } from 'src/app/team/dto/team'
import { TeamRepository } from 'src/app/team/query-service-interface/team-repository'
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class GetAllTeams implements TeamRepository {
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
