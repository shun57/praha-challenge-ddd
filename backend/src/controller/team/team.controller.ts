import { Body, Controller, Get, HttpCode, Put, Param } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase'
import { GetAllTeamsResponse } from 'src/controller/team/response/get-all-teams-response.dto'
import { PutTeamPairsRequest } from 'src/controller/team/request/put-team-pairs-request'
import { ChangeTeamPairsUseCase } from 'src/app/team/change-team-pairs-usecase'

@Controller('teams')
export class TeamController {
  constructor(
    private readonly getAllTeamsUseCase: GetAllTeamsUseCase,
    private readonly changeTeamPairsUseCase: ChangeTeamPairsUseCase
  ) { }
  @Get()
  @ApiResponse({ status: 200, type: GetAllTeamsResponse })
  async getTeams(): Promise<GetAllTeamsResponse> {
    const teams = await this.getAllTeamsUseCase.do()
    return new GetAllTeamsResponse({ teams: teams })
  }

  @Put(':teamId/pairs')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changeTeamPairs(
    @Param('teamId') teamId: string,
    @Body() patchTeamPairDto: PutTeamPairsRequest,
  ): Promise<void> {
    await this.changeTeamPairsUseCase.do({
      teamId: teamId,
      newPairIds: patchTeamPairDto.pairIds
    })
  }
}
