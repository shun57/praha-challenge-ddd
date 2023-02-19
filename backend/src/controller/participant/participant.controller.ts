import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllParticipantsResponse } from 'src/controller/participant/response/get-all-participants-response'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-paticipants-usecase'

@Controller('users')
export class ParticipantController {
  constructor(private readonly getAllParticipantsUseCase: GetAllParticipantsUseCase) { }
  @Get()
  @ApiResponse({ status: 200, type: GetAllParticipantsResponse })
  async getAll(): Promise<GetAllParticipantsResponse> {
    const participants = await this.getAllParticipantsUseCase.handle()
    return new GetAllParticipantsResponse(participants)
  }
}
