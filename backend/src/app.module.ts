import { Module } from '@nestjs/common'
import { ParticipantController } from 'src/controller/participant/participant.controller'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-paticipants-usecase'
import { GetAllParticipants } from 'src/infra/db/query-service/participant/get-all-participants'
import { PrismaService } from 'src/infra/db/prisma.service'
import { ConstantTokens } from 'src/shared/constants'
import { TeamController } from 'src/controller/team/team.controller'
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase'
import { GetAllTeams } from 'src/infra/db/query-service/team/get-all-teams'

@Module({
  imports: [],
  controllers: [ParticipantController, TeamController],
  providers: [
    PrismaService,
    GetAllParticipantsUseCase,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: GetAllParticipants
    },
    GetAllTeamsUseCase,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: GetAllTeams
    }
  ],
})
export class AppModule { }
