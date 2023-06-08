import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchPairParticipantsRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantIds!: string[]
}