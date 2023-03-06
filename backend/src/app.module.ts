import { Module } from '@nestjs/common'
import { ParticipantController } from 'src/controller/participant/participant.controller'
import { GetAllParticipantsUseCase } from 'src/app/participant/get-all-paticipants-usecase'
import { ParticipantQS } from 'src/infra/db/query-service/participant/participant-qs'
import { PrismaService } from 'src/infra/db/prisma.service'
import { ConstantTokens } from 'src/shared/constants'
import { TeamController } from 'src/controller/team/team.controller'
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase'
import { TeamQS } from 'src/infra/db/query-service/team/teams-qs'
import { PairController } from 'src/controller/pair/pair.controller'
import { PairQS } from 'src/infra/db/query-service/pair/pair-qs'
import { GetAllPairsUseCase } from 'src/app/pair/get-all-pairs-usecase'

@Module({
  imports: [],
  controllers: [ParticipantController, TeamController, PairController],
  providers: [
    PrismaService,
    GetAllParticipantsUseCase,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: ParticipantQS
    },
    GetAllTeamsUseCase,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: TeamQS
    },
    GetAllPairsUseCase,
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: PairQS
    }
  ],
})
export class AppModule { }
