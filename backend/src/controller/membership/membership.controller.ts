import { HttpCode, Param, Controller, Patch } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ChangePairParticipantUseCase } from 'src/app/membership/change-pair-participant-usecase'
import { PatchPairParticipantRequest } from 'src/controller/membership/request/patch-pair-participant-request'

@Controller('memberships')
export class MembershipController {
  constructor(
    private readonly changePairParticipantUseCase: ChangePairParticipantUseCase,
  ) { }

  @Patch(':membershipId/pair/:participantId')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changePairParticipant(
    @Param() params: PatchPairParticipantRequest
  ): Promise<void> {
    await this.changePairParticipantUseCase.do({
      membershipId: params.membershipId,
      newParticipantId: params.participantId
    })
  }
}
