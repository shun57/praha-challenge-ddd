import { Module } from '@nestjs/common'
import { ParticipantController } from 'src/controller/participant/participant.controller'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-paticipants-usecase'
import { GetAllParticipants } from 'src/infra/db/query-service/participant/get-all-participants'
import { PrismaService } from 'src/infra/db/prisma.service'
import { ConstantTokens } from 'src/shared/constants'

@Module({
  imports: [],
  controllers: [ParticipantController],
  providers: [
    GetAllParticipantsUseCase,
    PrismaService,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: GetAllParticipants
    }
  ],
})
export class AppModule { }
