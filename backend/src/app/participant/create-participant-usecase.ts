import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { IParticipantRepository } from "src/domain/interface/participant/participant-repository";
import { Participant } from "src/domain/entity/participant/participant";
import { ParticipantName } from "src/domain/value-object/participant/participant-name";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { ParticipantService } from "src/domain/service/participant-service";
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status";

export class CreateParticipantUseCase {
  public constructor(
    @Inject(ConstantTokens.PARTICIPANT_REPOSITORY) private readonly participantRepo: IParticipantRepository,
  ) { }

  public async do(params: { name: string, email: string }) {
    const participant = Participant.create({
      name: ParticipantName.create({ value: params.name }),
      email: ParticipantEmail.create({ value: params.email }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID())

    try {
      const participantService = new ParticipantService(this.participantRepo)
      if (await participantService.isDuplicateEmailBy(participant)) {
        throw new Error("メールアドレスが重複しています。")
      }
      await this.participantRepo.save(participant)
    } catch (error) {
      throw error
    }
  }
}