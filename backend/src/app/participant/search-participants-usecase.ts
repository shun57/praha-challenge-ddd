import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IParticipantQS } from "src/app/participant/query-service-interface/participant-qs"
import { ChallengeId } from "src/domain/value-object/challenge/challenge-id"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"
import { ParticipantChallengeProgress } from "src/domain/value-object/participant/participant-challenge-progress"

export class SearchParticipantsUseCase {
  public constructor(
    @Inject(ConstantTokens.REPOSITORY_QS)
    private readonly participantQS: IParticipantQS
  ) { }

  public async do(params: { challengeIds: string[], progress: string, pageNumber: number }) {
    const { challengeIds, progress, pageNumber } = params

    let challengeIdsEntity: ChallengeId[] = []
    const limit = 10
    const offset = limit * (pageNumber - 1)

    try {
      challengeIds.map((challengeId) => {
        challengeIdsEntity.push(ChallengeId.create(new UniqueEntityID(challengeId)))
      })
      const progressEntity = ParticipantChallengeProgress.create({ value: progress })
      return await this.participantQS.findByChallengesAndProgress(challengeIdsEntity, progressEntity, limit, offset)
    } catch (error) {
      throw error
    }
  }
}
