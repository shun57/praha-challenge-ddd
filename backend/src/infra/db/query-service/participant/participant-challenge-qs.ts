import { Injectable } from '@nestjs/common';
import { IParticipantChallengeQS } from 'src/app/participant/query-service-interface/participant-challenge-qs'
import { PrismaService } from 'src/infra/db/prisma.service'
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id';
import { ParticipantChallengeDTO } from 'src/app/participant/dto/participant-challenge';

@Injectable()
export class ParticipantChallengeQS implements IParticipantChallengeQS {
  public constructor(private readonly prisma: PrismaService) { }

  public async findByParticipantIdAndChallengeId(participantId: ParticipantId, challengeId: ChallengeId): Promise<ParticipantChallengeDTO> {
    const participantChallenge = await this.prisma.participantChallenge.findFirstOrThrow({
      where: {
        participantId: participantId.id.toString(),
        challengeId: challengeId.id.toString()
      },
    })
    return new ParticipantChallengeDTO({ ...participantChallenge })
  }
}
