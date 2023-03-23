import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PatchTeamPairRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly pairId!: string
}