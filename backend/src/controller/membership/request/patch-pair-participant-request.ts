import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchPairParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly membershipId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly participantId!: string
}