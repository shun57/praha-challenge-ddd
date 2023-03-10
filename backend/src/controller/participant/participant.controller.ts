import { HttpCode, Body, Param, Controller, Get, Patch } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-paticipants-usecase'
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase'
import { GetAllParticipantsResponse } from 'src/controller/participant/response/get-all-participants-response.dto'
import { PatchParticipantChallengeRequest } from './request/patch-participant-challenge-request'

@Controller('participants')
export class ParticipantController {
  constructor(
    private readonly getAllParticipantsUseCase: GetAllParticipantsUseCase,
    private readonly updateParticipantChallengeProgressUsecase: UpdateParticipantChallengeProgressUseCase
  ) { }

  @Get()
  @ApiResponse({ status: 200, type: GetAllParticipantsResponse })
  async getAll(): Promise<GetAllParticipantsResponse> {
    const participants = await this.getAllParticipantsUseCase.do()
    return new GetAllParticipantsResponse({ participants: participants })
  }

  @Patch('challenges/:challengeId/progress')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async updateChallengeProgress(
    @Param('challengeId') challengeId: string,
    @Body() patchParticioantChallengeDto: PatchParticipantChallengeRequest,
  ): Promise<void> {
    await this.updateParticipantChallengeProgressUsecase.do({
      participantId: patchParticioantChallengeDto.participantId,
      challengeId: challengeId,
      progress: patchParticioantChallengeDto.progress
    })
  }
}
