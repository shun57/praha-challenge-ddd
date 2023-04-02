import { Injectable } from '@nestjs/common';
import { Team } from 'src/domain/entity/team/team';
import { ITeamRepository } from 'src/domain/interface/team/repository-interface/team-repository';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { PrismaService } from 'src/infra/db/prisma.service'
import { TeamMapper } from 'src/infra/mapper/team-mapper';

@Injectable()
export class TeamRepository implements ITeamRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async getById(teamId: TeamId): Promise<Team | null> {
    const team = await this.prisma.team.findUnique({
      where: {
        id: teamId.id.toString(),
      },
      include: {
        pairs: {
          include: {
            pairMembers: true
          }
        }
      },
    })
    if (!team) {
      return null
    }
    // ペアメンバーを取得
    return TeamMapper.toEntity({ id: team.id, name: team.name, pairs: team.pairs })
  }

  public async save(team: Team): Promise<Team> {
    return await this.prisma.$transaction(async (prisma) => {
      const { id, name, pairIds } = TeamMapper.toData(team)
      // チームの作成or更新
      await prisma.team.upsert({
        where: {
          id: id
        },
        create: {
          id: id,
          name: name,
        },
        update: {
          name: name
        }
      })
      // ペアのチームを更新
      await this.prisma.pair.updateMany({
        where: { id: { in: pairIds } },
        data: {
          teamId: id
        }
      })
      return team
    })
  }
}
