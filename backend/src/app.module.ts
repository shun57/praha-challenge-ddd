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
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase'
import { ParticipantChallengeRepository } from 'src/infra/db/repository/participant-challenge-repository'
import { ParticipantChallengeQS } from 'src/infra/db/query-service/participant/participant-challenge-qs'

@Module({
  imports: [],
  controllers: [ParticipantController, TeamController, PairController],
  providers: [
    PrismaService,
    GetAllParticipantsUseCase,
    {
      provide: ConstantTokens.REPOSITORY_QS,
      useClass: ParticipantQS
    },
    UpdateParticipantChallengeProgressUseCase,
    {
      provide: ConstantTokens.REPOSITORY_QS_PC,
      useClass: ParticipantChallengeQS,
    },
    {
      provide: ConstantTokens.REPOSITORY,
      useClass: ParticipantChallengeRepository
    },
    GetAllTeamsUseCase,
    {
      provide: ConstantTokens.REPOSITORY_QS,
      useClass: TeamQS
    },
    GetAllPairsUseCase,
    {
      provide: ConstantTokens.REPOSITORY_QS,
      useClass: PairQS
    }
  ],
})
export class AppModule { }
