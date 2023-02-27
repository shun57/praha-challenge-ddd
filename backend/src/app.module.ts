import { Module } from '@nestjs/common'
import { ParticipantController } from 'src/controller/participant/participant.controller'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-paticipants-usecase'
import { GetAllParticipants } from 'src/infra/db/query-service/participant/get-all-participants'
import { PrismaService } from 'src/infra/db/prisma.service'
import { ConstantTokens } from 'src/shared/constants'
import { TeamController } from 'src/controller/team/team.controller'
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase'
import { GetAllTeams } from 'src/infra/db/query-service/team/get-all-teams'
import { PairController } from 'src/controller/pair/pair.controller'
import { GetAllPairs } from 'src/infra/db/query-service/pair/get-all-pairs'
import { GetAllPairsUseCase } from 'src/app/pair/get-all-pairs-usecase'

@Module({
  imports: [],
  controllers: [ParticipantController, TeamController, PairController],
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
    },
    GetAllPairsUseCase,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: GetAllPairs
    }
  ],
})
export class AppModule { }
