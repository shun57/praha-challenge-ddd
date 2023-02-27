import { Controller, Get } from '@nestjs/common'
import { ApiResponse } from '@nestjs/swagger'
import { GetAllPairsUseCase } from 'src/app/pair/get-all-pairs-usecase'
import { GetAllPairsResponse } from 'src/controller/pair/response/get-all-pairs-response.dto'

@Controller('pairs')
export class PairController {
  constructor(private readonly getAllPairsUseCase: GetAllPairsUseCase) { }
  @Get()
  @ApiResponse({ status: 200, type: GetAllPairsResponse })
  async getAll(): Promise<GetAllPairsResponse> {
    const pairs = await this.getAllPairsUseCase.handle()
    return new GetAllPairsResponse({ pairs: pairs })
  }
}
