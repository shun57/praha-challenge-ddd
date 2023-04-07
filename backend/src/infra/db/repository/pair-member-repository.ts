
import { Injectable } from '@nestjs/common';
import { PairMember } from 'src/domain/entity/pair-member/pair-member';
import { IPairMemberRepository } from 'src/domain/interface/pair-member/pair-member-repository';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { PrismaService } from 'src/infra/db/prisma.service'
import { PairMemberMapper } from 'src/infra/mapper/pair-member-mapper';

@Injectable()
export class PairMemberRepository implements IPairMemberRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async getByPairIds(pairIds: PairId[]): Promise<PairMember[]> {
    let pairIdsStr: string[] = []
    pairIds.map((pairId) => {
      pairIdsStr.push(pairId.id.toString())
    })
    const pairMembers = await this.prisma.pairMember.findMany({
      where: {
        id: {
          in: pairIdsStr
        }
      }
    })
    // Entityに変換
    let pairMemberEntities: PairMember[] = []
    pairMembers.map((pairMember) => {
      pairMemberEntities.push(PairMemberMapper.toEntity({ id: pairMember.id, pairId: pairMember.id, participantId: pairMember.participantId }))
    })
    return pairMemberEntities
  }
}