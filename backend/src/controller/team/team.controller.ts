import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase'
import { GetAllTeamsResponse } from 'src/controller/team/response/get-all-teams-response.dto'

@Controller('teams')
export class TeamController {
  constructor(private readonly getAllTeamsUseCase: GetAllTeamsUseCase) { }
  @Get()
  @ApiResponse({ status: 200, type: GetAllTeamsResponse })
  async getAll(): Promise<GetAllTeamsResponse> {
    const teams = await this.getAllTeamsUseCase.do()
    return new GetAllTeamsResponse({ teams: teams })
  }
}
