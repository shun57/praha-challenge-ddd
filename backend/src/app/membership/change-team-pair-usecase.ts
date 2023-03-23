import { Inject } from "@nestjs/common"
import { ConstantTokens } from "src/shared/constants"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { IMembershipRepository } from "src/domain/interface/membership/repository-interface/membership-repository";
import { PairId } from "src/domain/value-object/pair/pair-id";
import { MembershipId } from "src/domain/value-object/membership/membership-id";

export class ChangeTeamPairUseCase {
  public constructor(
    @Inject(ConstantTokens.REPOSITORY) private readonly membershipRepo: IMembershipRepository,
  ) { }

  public async do(params: { membershipId: string, newPairId: string }) {
    const { membershipId, newPairId } = params
    const membershipEntity = await this.membershipRepo.findById(
      MembershipId.create(new UniqueEntityID(membershipId))
    )

    if (!membershipEntity) {
      throw new Error("対象の会員が存在しません。")
    }

    membershipEntity.changeTeamPair(PairId.create(new UniqueEntityID(newPairId)))

    try {
      await this.membershipRepo.save(membershipEntity)
    } catch (error) {
      throw error
    }
  }
}