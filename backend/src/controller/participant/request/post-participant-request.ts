import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class PostParticipantRequest {
  @ApiProperty()
  @IsNotEmpty()
  readonly name!: string

  @ApiProperty()
  @IsNotEmpty()
  readonly email!: string
}