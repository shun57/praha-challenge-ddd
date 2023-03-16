import { HttpCode, Body, Param, Controller, Get, Post, Patch } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-participants-usecase'
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase'
import { GetAllParticipantsResponse } from 'src/controller/participant/response/get-all-participants-response.dto'
import { PatchParticipantChallengeRequest } from 'src/controller/participant/request/patch-participant-challenge-request'
import { PostParticipantRequest } from 'src/controller/participant/request/post-participant-request'
import { CreateParticipantUseCase } from 'src/app/participant/create-participant-usecase'

@Controller('participants')
export class ParticipantController {
  constructor(
    private readonly getAllParticipantsUseCase: GetAllParticipantsUseCase,
    private readonly updateParticipantChallengeProgressUsecase: UpdateParticipantChallengeProgressUseCase,
    private readonly createParticipantUseCase: CreateParticipantUseCase,
  ) { }

  @Get()
  @ApiResponse({ status: 200, type: GetAllParticipantsResponse })
  async getAll(): Promise<GetAllParticipantsResponse> {
    const participants = await this.getAllParticipantsUseCase.do()
    return new GetAllParticipantsResponse({ participants: participants })
  }

  @Post()
  @ApiResponse({ status: 201 })
  @HttpCode(201)
  async create(
    @Body() postParticipantDto: PostParticipantRequest,
  ): Promise<void> {
    await this.createParticipantUseCase.do({
      name: postParticipantDto.name,
      email: postParticipantDto.email
    })
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
