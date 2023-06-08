import { Injectable } from '@nestjs/common';
import { Pair } from 'src/domain/entity/pair/pair';
import { IPairRepository } from 'src/domain/interface/pair/pair-repository';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { CleanPrismaService, PrismaService } from 'src/infra/db/prisma.service'
import { PairIdsMapper } from 'src/infra/mapper/pair-ids-mapper';
import { PairMapper } from 'src/infra/mapper/pair-mapper';
import { ParticipantIdsMapper } from 'src/infra/mapper/participant-ids-mapper';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';

@Injectable()
export class PairRepository implements IPairRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async getAll(): Promise<Pair[]> {
    const pairs = await this.prisma.pair.findMany({
      include: {
        pairMembers: {
          select: {
            participant: true,
          },
        },
        teamPairs: {
          select: {
            teamId: true,
          },
        },
      },
    })
    // ペアをエンティティに変換
    let pairsEntity: Pair[] = []
    pairs.map((pair) => {
      const teamId = pair.teamPairs[0]?.teamId
      const participants = pair.pairMembers.map((pairMember) => pairMember.participant)
      pairsEntity.push(PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: teamId, participants: participants }))
    })
    return pairsEntity
  }

  public async getById(pairId: PairId): Promise<Pair | null> {
    const pair = await this.prisma.pair.findUnique({
      where: {
        id: pairId.id.toString(),
      },
      include: {
        pairMembers: {
          select: {
            participant: true,
          },
        },
        teamPairs: {
          select: {
            teamId: true,
          },
        },
      },
    })
    if (!pair) {
      return null
    }
    // チームと参加者を取得
    const teamId = pair.teamPairs[0]?.teamId
    const participants = pair.pairMembers.map((pairMember) => pairMember.participant)
    return PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: teamId, participants: participants })
  }

  public async getByIds(pairIds: PairId[]): Promise<Pair[]> {
    // 参加者IDを文字列化
    let pairIdsStr = PairIdsMapper.toData(pairIds)
    // 参加者のペアを取得
    const pairs = await this.prisma.pair.findMany({
      where: {
        id: {
          in: pairIdsStr
        }
      },
      include: {
        pairMembers: {
          select: {
            participant: true,
          },
        },
        teamPairs: {
          select: {
            teamId: true,
          },
        },
      },
    });
    // Entityに戻す
    let pairsEntity: Pair[] = []
    pairs.forEach((pair) => {
      const teamId = pair.teamPairs[0]?.teamId
      const participants = pair.pairMembers.map((pairMember) => pairMember.participant);
      pairsEntity.push(PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: teamId, participants: participants }))
    })
    return pairsEntity
  }

  public async getByTeamId(teamId: TeamId): Promise<Pair[]> {
    const pairs = await this.prisma.pair.findMany({
      where: {
        teamPairs: {
          some: {
            teamId: teamId.id.toString(),
          }
        }
      },
      include: {
        pairMembers: {
          select: {
            participant: true,
          },
        },
        teamPairs: {
          select: {
            teamId: true,
          },
        },
      },
    })
    // ペアをエンティティに変換
    let pairsEntity: Pair[] = []
    pairs.forEach((pair) => {
      const teamId = pair.teamPairs[0]?.teamId
      const participants = pair.pairMembers.map((pairMember) => pairMember.participant)
      pairsEntity.push(PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: teamId, participants: participants }))
    })
    return pairsEntity
  }

  public async getByParticipantId(participantId: ParticipantId): Promise<Pair | null> {
    // 参加者のペアを取得
    const pair = await this.prisma.pair.findFirst({
      where: {
        pairMembers: {
          some: {
            participantId: participantId.id.toString()
          }
        }
      },
      include: {
        pairMembers: {
          select: {
            participant: true,
          },
        },
        teamPairs: {
          select: {
            teamId: true,
          },
        },
      },
    })
    if (!pair) {
      return null
    }
    const teamId = pair.teamPairs[0]?.teamId
    const participants = pair.pairMembers.map((pairMember) => pairMember.participant)
    return PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: teamId, participants: participants })
  }

  public async getByParticipantIds(participantIds: ParticipantId[]): Promise<Pair[]> {
    // 参加者IDを文字列化
    const participantIdsStr = ParticipantIdsMapper.toData(participantIds)
    // 参加者のペアを取得
    const pairs = await this.prisma.pair.findMany({
      where: {
        pairMembers: {
          some: {
            participantId: {
              in: participantIdsStr,
            },
          },
        },
      },
      include: {
        pairMembers: {
          select: {
            participant: true,
          },
        },
        teamPairs: {
          select: {
            teamId: true,
          },
        },
      },
    });
    // Entityに戻す
    let pairsEntity: Pair[] = []
    pairs.forEach((pair) => {
      const teamId = pair.teamPairs[0]?.teamId
      const participants = pair.pairMembers.map((pairMember) => pairMember.participant);
      pairsEntity.push(PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: teamId, participants: participants }))
    })
    return pairsEntity
  }

  public async save(pair: Pair): Promise<Pair> {
    return await this.prisma.$transaction(async (prisma) => {
      const { id, name, teamId, participantIds } = PairMapper.toData(pair)
      // 既存ペアのメンバーの削除
      await prisma.pairMember.deleteMany({
        where: { pairId: id },
      });
      await prisma.pairMember.deleteMany({
        where: { participantId: { in: participantIds } },
      });
      // ペアに新しいメンバーを追加
      const newMembers = participantIds.map((participantId) => ({
        id: new UniqueEntityID().toString(),
        pairId: id,
        participantId: participantId,
      }))
      await prisma.pairMember.createMany({
        data: newMembers,
      })
      // ペアの作成or更新
      await prisma.pair.upsert({
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
      return pair
    })
  }

  public async saveInTransaction(pair: Pair, prisma: CleanPrismaService): Promise<Pair> {
    const { id, name, teamId, participantIds } = PairMapper.toData(pair)
    // ペアの作成or更新
    const upsertPair = prisma.pair.upsert({
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
    // 既存ペアのメンバーの削除
    const deleteMembers = prisma.pairMember.deleteMany({
      where: { pairId: id },
    });
    // ペアに新しいメンバーを追加
    const newMembers = participantIds.map((participantId) => ({
      id: new UniqueEntityID().toString(),
      pairId: id,
      participantId: participantId,
    }))
    const createMembers = prisma.pairMember.createMany({
      data: newMembers,
    })

    await Promise.all([upsertPair, deleteMembers, createMembers]);

    return pair
  }

  public async deleteInTransaction(pair: Pair, prisma: CleanPrismaService): Promise<void> {
    const deleteMembers = prisma.pairMember.deleteMany({
      where: { pairId: pair.pairId.id.toString() },
    });
    const deleteTeamPairs = prisma.teamPair.deleteMany({
      where: { pairId: pair.pairId.id.toString() },
    });
    const deletePair = prisma.pair.delete({
      where: {
        id: pair.pairId.id.toString(),
      },
    });

    await Promise.all([deleteMembers, deleteTeamPairs, deletePair]);
  }
}
