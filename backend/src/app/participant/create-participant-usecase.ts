import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IParticipantRepository } from "src/domain/interface/participant/repository-interface/participant-repository";
import { IParticipantQS } from "src/domain/interface/participant/query-service-interface/participant-qs"
import { Participant } from "src/domain/entity/participant/participant";
import { ParticipantName } from "src/domain/value-object/participant/participant-name";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";

export class CreateParticipantUseCase {
  public constructor(
    @Inject(ConstantTokens.REPOSITORY_QS_PC) private readonly participantQS: IParticipantQS,
    @Inject(ConstantTokens.REPOSITORY) private readonly participantRepo: IParticipantRepository,
  ) { }

  public async do(params: { name: string, email: string }) {
    const { name, email } = params

    try {
      const isExist = await this.participantQS.isExist(ParticipantEmail.create({ value: email }))
      if (isExist) {
        throw new Error("メールアドレスが重複しています。")
      }
      const participant = Participant.create({
        name: ParticipantName.create({ value: name }),
        email: ParticipantEmail.create({ value: email }),
      }, new UniqueEntityID())
      await this.participantRepo.save(participant)
    } catch (error) {
      throw error
    }
  }
}