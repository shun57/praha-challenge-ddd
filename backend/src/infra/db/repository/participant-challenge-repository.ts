import { Injectable } from '@nestjs/common';
import { ParticipantChallenge } from "src/domain/entity/participant/participant-challenge";
import { IParticipantChallengeRepository } from 'src/domain/interface/participant/participant-challenge-repository';
import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { PrismaService } from 'src/infra/db/prisma.service'
import { ParticipantChallengeMapper } from 'src/infra/mapper/participant-challenge-mapper';

@Injectable()
export class ParticipantChallengeRepository implements IParticipantChallengeRepository {
  public constructor(private readonly prisma: PrismaService) { }

  public async getByParticipantIdAndChallengeId(participantId: ParticipantId, challengeId: ChallengeId): Promise<ParticipantChallenge | null> {
    const participantChallenge = await this.prisma.participantChallenge.findUnique({
      where: {
        participantId: participantId.id.toString(),
        challengeId: challengeId.id.toString()
      },
    })
    if (!participantChallenge) {
      return null
    }
    return ParticipantChallengeMapper.toEntity(participantChallenge)
  }

  public async save(participantChallenge: ParticipantChallenge): Promise<void> {
    await this.prisma.participantChallenge.upsert({
      where: {
        participantId_challengeId: {
          participantId: participantChallenge.participantId.id.toString(),
          challengeId: participantChallenge.challengeId.id.toString()
        }
      },
      create: {
        participantId: participantChallenge.participantId.id.toString(),
        challengeId: participantChallenge.challengeId.id.toString(),
        progress: participantChallenge.progress.value
      },
      update: {
        progress: participantChallenge.progress.value
      }
    })
  }
}
