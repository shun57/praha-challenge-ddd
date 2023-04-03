import { Injectable } from '@nestjs/common'
import { ParticipantDTO } from 'src/app/participant/dto/participant'
import { IParticipantQS } from 'src/app/participant/query-service-interface/participant-qs'
import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id'
import { ParticipantChallengeProgress } from 'src/domain/value-object/participant/participant-challenge-progress'
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class ParticipantQS implements IParticipantQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async findByChallengesAndProgress(challengeIds: ChallengeId[], progress: ParticipantChallengeProgress, limit: number, offset: number): Promise<Page<ParticipantDTO>> {
    const challengeIdsStr = challengeIds.map(challengeId => challengeId.id.toString())
    const [participants, totalCount] = await Promise.all([
      this.prisma.participant.findMany({
        where: {
          participantChallenges: {
            some: {
              challengeId: { in: challengeIdsStr || [] },
              progress: { in: progress.value || undefined }
            }
          }
        },
        skip: limit,
        take: offset,
      }),
      this.prisma.participant.count({
        where: {
          participantChallenges: {
            some: {
              challengeId: { in: challengeIdsStr || [] },
              progress: { in: progress.value || undefined }
            }
          }
        }
      })
    ])
    // DTOに詰め替えて返す
    const participantDtos = participants.map((participant) => new ParticipantDTO({ ...participant }),)
    const paging = <Paging>{ totalCount: totalCount, limit: limit, offset: offset }
    return <Page<ParticipantDTO>>{ items: participantDtos, paging: paging }
  }
}
