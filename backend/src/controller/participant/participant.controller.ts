import { HttpCode, Body, Param, Query, Controller, Get, Post, Patch } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase'
import { PatchParticipantChallengeRequest } from 'src/controller/participant/request/patch-participant-challenge-request'
import { PostParticipantRequest } from 'src/controller/participant/request/post-participant-request'
import { CreateParticipantUseCase } from 'src/app/participant/create-participant-usecase'
import { UpdateParticipantUseCase } from 'src/app/participant/update-participant-usecase'
import { PatchParticipantRequest } from 'src/controller/participant/request/patch-participant-request'
import { SearchParticipantsRequest } from './request/search-participant-request'
import { SearchParticipantsUseCase } from 'src/app/participant/search-participants-usecase'
import { SearchParticipantsResponse } from './response/search-participants-response.dto'

@Controller('participants')
export class ParticipantController {
  constructor(
    private readonly searchParticipantsUseCase: SearchParticipantsUseCase,
    private readonly createParticipantUseCase: CreateParticipantUseCase,
    private readonly updateParticipantUseCase: UpdateParticipantUseCase,
    private readonly updateParticipantChallengeProgressUsecase: UpdateParticipantChallengeProgressUseCase,
  ) { }

  @Get()
  @ApiResponse({ status: 200, type: SearchParticipantsResponse })
  async searchParticipants(
    @Query() searchParticipantsDto: SearchParticipantsRequest,
  ): Promise<SearchParticipantsResponse> {
    let challengeIds: string[] | undefined
    if (typeof searchParticipantsDto.challengeIds === 'string') {
      challengeIds = [searchParticipantsDto.challengeIds];
    } else {
      challengeIds = searchParticipantsDto.challengeIds
    }
    const participants = await this.searchParticipantsUseCase.do({
      challengeIds: challengeIds,
      progress: searchParticipantsDto.progress,
      pageIndex: searchParticipantsDto.pageIndex
    })
    return new SearchParticipantsResponse({ participants: participants })
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

  @Patch(':participantId')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async update(
    @Param('participantId') participantId: string,
    @Body() patchParticipantRequest: PatchParticipantRequest,
  ): Promise<void> {
    await this.updateParticipantUseCase.do({
      participantId: participantId,
      enrollmentStatus: patchParticipantRequest.enrollmentStatus
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
