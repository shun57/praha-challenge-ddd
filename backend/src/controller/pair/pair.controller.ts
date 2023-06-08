import { Body, Controller, Get, HttpCode, Patch, Param } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { ChangePairParticipantsUseCase } from 'src/app/pair/change-pair-participants-usecase'
import { GetAllPairsUseCase } from 'src/app/pair/get-all-pairs-usecase'
import { GetAllPairsResponse } from 'src/controller/pair/response/get-all-pairs-response.dto'
import { PatchPairParticipantsRequest } from 'src/controller/pair/request/patch-pair-participants-request'

@Controller('pairs')
export class PairController {
  constructor(
    private readonly getAllPairsUseCase: GetAllPairsUseCase,
    private readonly changePairParticipantsUseCase: ChangePairParticipantsUseCase
  ) { }

  @Get()
  @ApiResponse({ status: 200, type: GetAllPairsResponse })
  async getAll(): Promise<GetAllPairsResponse> {
    const pairs = await this.getAllPairsUseCase.do()
    return new GetAllPairsResponse({ pairs: pairs })
  }

  @Patch(':pairId/participant')
  @HttpCode(204)
  @ApiResponse({ status: 204 })
  async changePairParticipant(
    @Param('pairId') pairId: string,
    @Body() patchPairParticipantsDto: PatchPairParticipantsRequest,
  ): Promise<void> {
    await this.changePairParticipantsUseCase.do({
      pairId: pairId,
      newParticipantIds: patchPairParticipantsDto.participantIds
    })
  }
}
