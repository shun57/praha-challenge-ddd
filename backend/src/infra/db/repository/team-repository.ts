import { Injectable } from '@nestjs/common';
import { Pair } from 'src/domain/entity/pair/pair';
import { Team } from 'src/domain/entity/team/team';
import { IPairRepository } from 'src/domain/interface/pair/repository-interface/pair-repository';
import { ITeamRepository } from 'src/domain/interface/team/repository-interface/team-repository';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { PrismaService } from 'src/infra/db/prisma.service'
import { PairMapper } from 'src/infra/mapper/pair-mapper';
import { TeamMapper } from 'src/infra/mapper/team-mapper';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';

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
    // const pairMembers = team.pairs.map((pair) => pair.pairMembers)
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
