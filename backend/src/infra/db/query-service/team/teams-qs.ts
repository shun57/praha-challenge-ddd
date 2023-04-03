import { Injectable } from '@nestjs/common';
import { TeamDTO } from 'src/app/team/dto/team'
import { ITeamQS } from 'src/app/team/query-service-interface/team-qs'
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class TeamQS implements ITeamQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async getAll(): Promise<TeamDTO[]> {
    const teams = await this.prisma.team.findMany()
    return teams.map(
      (team) =>
        new TeamDTO({
          ...team,
        }),
    )
  }
}
