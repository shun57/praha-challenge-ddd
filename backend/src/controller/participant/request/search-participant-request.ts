import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class SearchParticipantsRequest {
  @ApiProperty()
  readonly challengeIds!: string[]

  @ApiProperty()
  readonly progress!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly pageNumber!: number
}