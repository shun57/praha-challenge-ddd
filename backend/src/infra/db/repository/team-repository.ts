import { Injectable } from '@nestjs/common';
import { Team } from 'src/domain/entity/team/team';
import { ITeamRepository } from 'src/domain/interface/team/team-repository';
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
        teamPairs: {
          include: { pair: { include: { pairMembers: true } } },
        },
      },
    })
    if (!team) {
      return null
    }
    // ペアを取得
    const pairs = team.teamPairs.map((teamPair) => teamPair.pair)
    const pairsMembers = team.teamPairs.map((teamPair) => teamPair.pair.pairMembers)
    return TeamMapper.toEntity({ id: team.id, name: team.name, pairs: pairs, pairsMembers: pairsMembers })
  }

  public async getAll(): Promise<Team[]> {
    const teams = await this.prisma.team.findMany({
      include: {
        teamPairs: {
          include: { pair: { include: { pairMembers: true } } },
        },
      },
    })
    let teamsEntity: Team[] = []
    teams.map((team) => {
      const pairs = team.teamPairs.map((teamPair) => teamPair.pair)
      const pairsMembers = team.teamPairs.map(teamPair => teamPair.pair.pairMembers)
      teamsEntity.push(TeamMapper.toEntity({ id: team.id, name: team.name, pairs: pairs, pairsMembers: pairsMembers }))
    })
    return teamsEntity
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
      // team所属ペアを全削除
      await prisma.teamPair.deleteMany({
        where: {
          teamId: id,
        },
      })
      // team所属ペアを作成
      const teamPairs = pairIds.map(pairId => ({
        teamId: id,
        pairId
      }))
      await this.prisma.teamPair.createMany({
        data: teamPairs
      })
      return team
    })
  }
}
