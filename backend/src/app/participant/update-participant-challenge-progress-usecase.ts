import { Inject, NotFoundException } from "@nestjs/common"
import { ParticipantChallenge } from 'src/domain/entity/participant/participant-challenge';
import { IParticipantChallengeRepository } from "src/domain/interface/participant/participant-challenge-repository";
import { ConstantTokens } from "src/shared/constants"
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { ChallengeId } from "src/domain/value-object/challenge/challenge-id";
import { ParticipantChallengeProgress } from "src/domain/value-object/participant/participant-challenge-progress";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";

export class UpdateParticipantChallengeProgressUseCase {
  public constructor(
    @Inject(ConstantTokens.PARTICIPANT_CHALLENGE_REPOSITORY) private readonly participantChallengeRepo: IParticipantChallengeRepository,
  ) { }

  public async do(params: { participantId: string, challengeId: string, progress: string }) {
    const { participantId, challengeId, progress } = params

    try {
      const participantChallengeEntity = await this.participantChallengeRepo.getByParticipantIdAndChallengeId(
        ParticipantId.create(new UniqueEntityID(participantId)),
        ChallengeId.create(new UniqueEntityID(challengeId))
      )
      if (!participantChallengeEntity) {
        throw new NotFoundException("対象課題が見つかりません")
      }
      participantChallengeEntity.updateProgress(ParticipantChallengeProgress.create({ value: progress }))
      await this.participantChallengeRepo.save(participantChallengeEntity)
    } catch (error) {
      throw error
    }
  }
}