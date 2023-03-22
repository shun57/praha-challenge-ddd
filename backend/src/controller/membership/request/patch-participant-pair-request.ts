import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchParticipantPairRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly membershipId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly participantId!: string
}