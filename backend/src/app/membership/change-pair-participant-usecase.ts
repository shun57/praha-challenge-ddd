import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { IMembershipRepository } from "src/domain/interface/membership/repository-interface/membership-repository";
import { MembershipId } from "src/domain/value-object/membership/membership-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";

export class ChangePairParticipantUseCase {
  public constructor(
    @Inject(ConstantTokens.REPOSITORY) private readonly membershipRepo: IMembershipRepository,
  ) { }

  public async do(params: { membershipId: string, newParticipantId: string }) {
    const { membershipId, newParticipantId } = params
    const membershipEntity = await this.membershipRepo.findById(
      MembershipId.create(new UniqueEntityID(membershipId))
    )

    if (!membershipEntity) {
      throw new Error("対象の会員が存在しません。")
    }

    membershipEntity.changePairParticipant(ParticipantId.create(new UniqueEntityID(newParticipantId)))

    try {
      await this.membershipRepo.save(membershipEntity)
    } catch (error) {
      throw error
    }
  }
}