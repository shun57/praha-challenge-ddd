import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IParticipantQS } from "src/domain/interface/participant/query-service-interface/participant-qs"

export class GetAllParticipantsUseCase {
    public constructor(
        @Inject(ConstantTokens.REPOSITORY_QS)
        private readonly participantQS: IParticipantQS
    ) { }

    public async do() {
        try {
            return await this.participantQS.getAll()
        } catch (error) {
            throw error
        }
    }
}
