
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PutTeamPairsRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly pairIds!: string[]
}