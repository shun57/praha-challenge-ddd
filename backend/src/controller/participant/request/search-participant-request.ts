import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SearchParticipantsRequest {
  @ApiProperty({ required: false })
  readonly challengeIds?: string[]

  @ApiProperty({ required: false })
  readonly progress?: string

  @ApiProperty()
  @IsNotEmpty()
  readonly pageIndex!: number
}