import { Injectable } from '@nestjs/common';
import { ParticipantChallenge } from "src/domain/entity/participant/participant-challenge";
import { IParticipantChallengeRepository } from 'src/app/participant/repository-interface/participant-challenge-repository';
import { PrismaService } from 'src/infra/db/prisma.service'

@Injectable()
export class ParticipantChallengeRepository implements IParticipantChallengeRepository {
  public constructor(private readonly prisma: PrismaService) { }

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
