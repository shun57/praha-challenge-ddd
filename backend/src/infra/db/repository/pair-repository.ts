import { Injectable } from '@nestjs/common';
import { Pair } from 'src/domain/entity/pair/pair';
import { IPairRepository } from 'src/domain/interface/pair/repository-interface/pair-repository';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { PrismaService } from 'src/infra/db/prisma.service'
import { PairMapper } from 'src/infra/mapper/pair-mapper';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';

@Injectable()
export class PairRepository implements IPairRepository {
  public constructor(private readonly prisma: PrismaService) { }

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
      },
    })
    if (!pair) {
      return null
    }
    // 参加者を取得
    const participants = pair.pairMembers.map((pairMember) => pairMember.participant);
    return PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: pair.teamId, participants: participants })
  }

  public async getByParticipantIds(participantIds: ParticipantId[]): Promise<Pair[]> {
    // 参加者IDを文字列化
    let participantIdsStr: string[] = []
    participantIds.map((participantId) => {
      participantIdsStr.push(participantId.id.toString())
    })
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
      },
    });
    // Entityに戻す
    let pairsEntity: Pair[] = []
    pairs.map((pair) => {
      const participants = pair.pairMembers.map((pairMember) => pairMember.participant);
      pairsEntity.push(PairMapper.toEntity({ id: pair.id, name: pair.name, teamId: pair.teamId, participants: participants }))
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
          teamId: teamId,
        },
        update: {
          name: name
        }
      })
      return pair
    })
  }
}
