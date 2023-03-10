import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchParticipantChallengeRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly participantId!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly progress!: string
}