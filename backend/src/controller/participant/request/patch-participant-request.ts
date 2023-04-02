import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly enrollmentStatus!: string
}