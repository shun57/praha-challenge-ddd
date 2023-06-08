import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IParticipantQS } from "src/app/participant/query-service-interface/participant-qs"
import { ChallengeId } from "src/domain/value-object/challenge/challenge-id"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"
import { ParticipantChallengeProgress } from "src/domain/value-object/participant/participant-challenge-progress"

export class SearchParticipantsUseCase {
  public constructor(
    @Inject(ConstantTokens.PARTICIPANT_QS)
    private readonly participantQS: IParticipantQS
  ) { }

  public async do(params: { challengeIds: string[] | undefined, progress: string | undefined, pageIndex: number }) {
    const { challengeIds, progress, pageIndex } = params

    const limit = 10
    const offset = limit * pageIndex

    try {
      let challengeIdsEntity: ChallengeId[] = []
      if (challengeIds && challengeIds.length > 0) {
        challengeIdsEntity = challengeIds.map((challengeId) => {
          return ChallengeId.create(new UniqueEntityID(challengeId))
        })
      }
      return await this.participantQS.findByChallengesAndProgress(challengeIdsEntity, progress, limit, offset)
    } catch (error) {
      throw error
    }
  }
}
