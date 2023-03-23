import { HttpCode, Body, Param, Controller, Patch } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ChangePairParticipantUseCase } from 'src/app/membership/change-pair-participant-usecase'
import { ChangeTeamPairUseCase } from 'src/app/membership/change-team-pair-usecase'
import { PatchPairParticipantRequest } from 'src/controller/membership/request/patch-pair-participant-request'
import { PatchTeamPairRequest } from 'src/controller/membership/request/patch-team-pair-request'

@Controller('memberships')
export class MembershipController {
  constructor(
    private readonly changePairParticipantUseCase: ChangePairParticipantUseCase,
    private readonly changeTeamPairUseCase: ChangeTeamPairUseCase,
  ) { }

  @Patch(':membershipId/participant')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changePairParticipant(
    @Param('membershipId') membershipId: string,
    @Body() patchPairParticipantDto: PatchPairParticipantRequest,
  ): Promise<void> {
    await this.changePairParticipantUseCase.do({
      membershipId: membershipId,
      newParticipantId: patchPairParticipantDto.participantId
    })
  }

  @Patch(':membershipId/pair')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changeTeamPair(
    @Param('membershipId') membershipId: string,
    @Body() patchTeamPairDto: PatchTeamPairRequest,
  ): Promise<void> {
    await this.changeTeamPairUseCase.do({
      membershipId: membershipId,
      newPairId: patchTeamPairDto.pairId
    })
  }
}
