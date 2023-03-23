import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchPairParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId!: string
}