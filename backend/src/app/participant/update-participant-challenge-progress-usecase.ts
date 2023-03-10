import { Inject } from "@nestjs/common"
import { ParticipantChallenge } from 'src/domain/entity/participant/participant-challenge';
import { IParticipantChallengeQS } from "src/app/participant/query-service-interface/participant-challenge-qs";
import { IParticipantChallengeRepository } from 'src/app/participant/repository-interface/participant-challenge-repository';
import { ConstantTokens } from "src/shared/constants"
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { ChallengeId } from "src/domain/value-object/challenge/challenge-id";
import { ParticipantChallengeProgress } from "src/domain/value-object/participant/participant-challenge-progress";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";

export class UpdateParticipantChallengeProgressUseCase {
  public constructor(
    @Inject(ConstantTokens.REPOSITORY_QS_PC) private readonly participantChallengeQS: IParticipantChallengeQS,
    @Inject(ConstantTokens.REPOSITORY) private readonly participantChallengeRepo: IParticipantChallengeRepository,
  ) { }

  public async do(params: { participantId: string, challengeId: string, progress: string }) {
    const { participantId, challengeId, progress } = params

    const participantChallenge = ParticipantChallenge.create({
      participantId: ParticipantId.create(new UniqueEntityID(participantId)),
      challengeId: ChallengeId.create(new UniqueEntityID(challengeId)),
      progress: ParticipantChallengeProgress.create({ value: progress })
    })

    try {
      const participantChallengeDTO = await this.participantChallengeQS.findByParticipantIdAndChallengeId(participantChallenge.participantId, participantChallenge.challengeId)
      const participantChallengeEntity = ParticipantChallenge.create({
        participantId: ParticipantId.create(new UniqueEntityID(participantChallengeDTO.participantId)),
        challengeId: ChallengeId.create(new UniqueEntityID(participantChallengeDTO.challengeId)),
        progress: ParticipantChallengeProgress.create({ value: participantChallengeDTO.progress })
      })
      participantChallengeEntity.updateProgress(participantChallenge.progress)
      await this.participantChallengeRepo.save(participantChallengeEntity)
    } catch (error) {
      throw error
    }
  }
}