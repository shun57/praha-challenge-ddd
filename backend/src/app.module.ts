import { Module } from '@nestjs/common'
import { MailerModule, MailerService } from '@nestjs-modules/mailer'
import { PrismaService } from 'src/infra/db/prisma.service'
import { ConstantTokens } from 'src/shared/constants'
import { ParticipantController } from 'src/controller/participant/participant.controller'
import { TeamController } from 'src/controller/team/team.controller'
import { PairController } from 'src/controller/pair/pair.controller'
import { ChangePairParticipantsUseCase } from './app/pair/change-pair-participants-usecase'
import { GetAllPairsUseCase } from 'src/app/pair/get-all-pairs-usecase'
import { CreateParticipantUseCase } from 'src/app/participant/create-participant-usecase'
import { SearchParticipantsUseCase } from './app/participant/search-participants-usecase'
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase'
import { UpdateParticipantUseCase } from './app/participant/update-participant-usecase'
import { ChangeTeamPairsUseCase } from './app/team/change-team-pairs-usecase'
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase'
import { ParticipantQS } from 'src/infra/db/query-service/participant/participant-qs'
import { ParticipantChallengeRepository } from 'src/infra/db/repository/participant-challenge-repository'
import { ParticipantRepository } from 'src/infra/db/repository/participant-repository'
import { PairRepository } from './infra/db/repository/pair-repository'
import { TeamRepository } from './infra/db/repository/team-repository'
import { PairMemberRepository } from './infra/db/repository/pair-member-repository'
import { MailRepository } from './infra/db/repository/mail-repository'

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'localhost',
        port: 1025,
        ignoreTLS: true,
      },
    }),
  ],
  controllers: [ParticipantController, TeamController, PairController],
  providers: [
    PrismaService,
    ChangePairParticipantsUseCase,
    GetAllPairsUseCase,
    CreateParticipantUseCase,
    SearchParticipantsUseCase,
    UpdateParticipantChallengeProgressUseCase,
    UpdateParticipantUseCase,
    ChangeTeamPairsUseCase,
    GetAllTeamsUseCase,
    {
      provide: ConstantTokens.PAIR_REPOSITORY,
      useClass: PairRepository
    },
    {
      provide: ConstantTokens.PARTICIPANT_REPOSITORY,
      useClass: ParticipantRepository
    },
    {
      provide: ConstantTokens.PARTICIPANT_QS,
      useClass: ParticipantQS
    },
    {
      provide: ConstantTokens.PARTICIPANT_CHALLENGE_REPOSITORY,
      useClass: ParticipantChallengeRepository
    },
    {
      provide: ConstantTokens.PAIR_MEMBER_REPOSITORY,
      useClass: PairMemberRepository
    },
    {
      provide: ConstantTokens.TEAM_REPOSITORY,
      useClass: TeamRepository
    },
    {
      provide: ConstantTokens.MAIL_REPOSITORY,
      useClass: MailRepository
    },
  ],
})
export class AppModule { }
