import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IParticipantQS } from "src/app/participant/query-service-interface/participant-qs"

export class SearchParticipantsUseCase {
  public constructor(
    @Inject(ConstantTokens.REPOSITORY_QS)
    private readonly participantQS: IParticipantQS
  ) { }

  public async do(params: { taskIds: string[], status: string, limit: string, offset: string }) {
    try {
      return await this.participantQS.getAll()
    } catch (error) {
      throw error
    }
  }
}
