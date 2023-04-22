import { Test, TestingModule } from '@nestjs/testing';
import { ConstantTokens } from 'src/shared/constants';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { IParticipantRepository } from 'src/domain/interface/participant/participant-repository';
import { Participant } from 'src/domain/entity/participant/participant';
import { ParticipantName } from 'src/domain/value-object/participant/participant-name';
import { ParticipantEmail } from 'src/domain/value-object/participant/participant-email';
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from 'src/domain/value-object/participant/participant-enrollment-status';
import { UpdateParticipantUseCase } from '../update-participant-usecase';
import { ITeamRepository } from 'src/domain/interface/team/team-repository';
import { IPairRepository } from 'src/domain/interface/pair/pair-repository';
import { IMailRepository } from 'src/domain/interface/mail/mail-repository';
import { PrismaService } from 'src/infra/db/prisma.service';
import { SecessionMemberSpecification } from 'src/domain/specification/secession-member-specification';
import { PairService } from 'src/domain/service/pair-service';
import { TeamService } from 'src/domain/service/team-service';
import { Pair } from 'src/domain/entity/pair/pair';
import { PairName } from 'src/domain/value-object/pair/pair-name';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { Team } from 'src/domain/entity/team/team';
import { TeamName } from 'src/domain/value-object/team/team-name';
import { PairId } from 'src/domain/value-object/pair/pair-id';

describe('do', () => {
  let useCase: UpdateParticipantUseCase;
  let participantRepo: IParticipantRepository;
  let teamRepo: ITeamRepository;
  let pairRepo: IPairRepository;
  let mailRepo: IMailRepository;
  let prismaService: PrismaService;

  // テストデータ
  const resessParams = { participantId: "2", enrollmentStatus: "休会中" };
  const combackParams = { participantId: "1", enrollmentStatus: "在籍中" };
  const withdrawParams = { participantId: "3", enrollmentStatus: "退会済み" }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateParticipantUseCase,
        {
          provide: ConstantTokens.PARTICIPANT_REPOSITORY,
          useValue: {
            getById: jest.fn(),
            getByIds: jest.fn(),
            save: jest.fn(),
            saveInTransaction: jest.fn(),
          },
        },
        {
          provide: ConstantTokens.PAIR_REPOSITORY,
          useValue: {
            getByParticipantId: jest.fn(),
            saveInTransaction: jest.fn(),
          },
        },
        {
          provide: ConstantTokens.TEAM_REPOSITORY,
          useValue: {
            getById: jest.fn(),
          },
        },
        {
          provide: ConstantTokens.MAIL_REPOSITORY,
          useValue: {
            send: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $transaction: jest.fn().mockImplementation(async (cb) => {
              await cb(prismaService);
            }),
          },
        },
        SecessionMemberSpecification,
        PairService,
        TeamService,
      ],
    }).compile();

    useCase = module.get<UpdateParticipantUseCase>(UpdateParticipantUseCase);
    participantRepo = module.get<IParticipantRepository>(ConstantTokens.PARTICIPANT_REPOSITORY);
    teamRepo = module.get<ITeamRepository>(ConstantTokens.TEAM_REPOSITORY);
    pairRepo = module.get<IPairRepository>(ConstantTokens.PAIR_REPOSITORY);
    mailRepo = module.get<IMailRepository>(ConstantTokens.MAIL_REPOSITORY);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    const resessedParticipant2 = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
    }, new UniqueEntityID(withdrawParams.participantId));

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(resessedParticipant2);
    jest.spyOn(participantRepo, 'saveInTransaction').mockResolvedValueOnce(resessedParticipant2);
    return expect(
      useCase.do(withdrawParams),
    ).resolves.toBe(undefined)
  });

  it('[正常系]:復帰処理で例外が発生しないこと', async () => {
    const resessedParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
    }, new UniqueEntityID(combackParams.participantId))
    const pair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const team = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID())],
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    });

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(resessedParticipant);
    jest.spyOn(TeamService.prototype, 'getMinimumTeam').mockResolvedValue(team);
    jest.spyOn(PairService.prototype, 'getMinimumPairBy').mockResolvedValue(pair);
    jest.spyOn(participantRepo, 'saveInTransaction').mockResolvedValueOnce(resessedParticipant);

    return expect(
      useCase.do(combackParams),
    ).resolves.toBe(undefined)
  });

  it('[正常系]:復帰処理の場合でペアが最大人数を超えた場合、分解して保存', async () => {
    const resessedParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
    }, new UniqueEntityID(combackParams.participantId));
    const maxPair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const team = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID())],
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    });

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(resessedParticipant);
    jest.spyOn(TeamService.prototype, 'getMinimumTeam').mockResolvedValue(team);
    jest.spyOn(PairService.prototype, 'getMinimumPairBy').mockResolvedValue(maxPair);
    jest.spyOn(PairService.prototype, 'devidePairIfOverMember').mockResolvedValue();
    jest.spyOn(participantRepo, 'saveInTransaction').mockResolvedValueOnce(resessedParticipant);

    await useCase.do(combackParams)
    expect(PairService.prototype.devidePairIfOverMember).toHaveBeenCalledTimes(1)
  });

  it('[正常系]:脱退処理で例外が発生しないこと', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const maxPair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const team = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID())],
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    });

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(maxPair);
    jest.spyOn(pairRepo, 'saveInTransaction').mockResolvedValueOnce(maxPair);
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(team);
    jest.spyOn(participantRepo, 'saveInTransaction').mockResolvedValueOnce(enrolledParticipant);

    return expect(
      useCase.do(resessParams),
    ).resolves.toBe(undefined)
  });

  it('[正常系]:脱退処理の場合、チームの参加者数が条件を満たさなくなった場合、アラートメールを送る', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const maxPair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const minTeam = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID())],
      participantIds: [ParticipantId.create(new UniqueEntityID("1")), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    })
    minTeam.participantIds.splice(0, 1)

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(maxPair);
    jest.spyOn(pairRepo, 'saveInTransaction').mockResolvedValueOnce(maxPair);
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(minTeam);
    jest.spyOn(SecessionMemberSpecification.prototype, 'sendAlertMailToAdminerIfTeamMemberNotFilled').mockResolvedValue();
    jest.spyOn(participantRepo, 'saveInTransaction').mockResolvedValueOnce(enrolledParticipant);

    await useCase.do(resessParams)
    expect(SecessionMemberSpecification.prototype.sendAlertMailToAdminerIfTeamMemberNotFilled).toHaveBeenCalledTimes(1);
  });

  it('[正常系]:脱退処理の場合、脱退したことでペアの参加者数が条件を満たさない場合、残りのペアメンバーを移動する', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const minPair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID("1")), ParticipantId.create(new UniqueEntityID("2"))],
    });
    const minTeam = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID()), PairId.create(new UniqueEntityID()),],
      participantIds: [ParticipantId.create(new UniqueEntityID("1")), ParticipantId.create(new UniqueEntityID("2")), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    });

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(minPair);
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(minTeam);
    jest.spyOn(PairService.prototype, 'getMinimumPairBy').mockResolvedValue(minPair);
    jest.spyOn(pairRepo, 'saveInTransaction').mockResolvedValueOnce(minPair);
    jest.spyOn(SecessionMemberSpecification.prototype, 'moveAnotherMinPairIfPairMemberNotFilled').mockResolvedValue();
    jest.spyOn(participantRepo, 'saveInTransaction').mockResolvedValueOnce(enrolledParticipant);

    await useCase.do(resessParams)
    expect(SecessionMemberSpecification.prototype.moveAnotherMinPairIfPairMemberNotFilled).toHaveBeenCalledTimes(1)
  });

  it('[異常系]:participantRepo.getByIdでnullの場合、例外が発生する', async () => {
    const errorMessage = '対象の会員が存在しません。';
    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(null);

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:participantRepo.getByIdで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting participant';
    jest.spyOn(participantRepo, 'getById').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:復帰:teamService.getMinimumTeamでundefinedの場合、例外が発生する', async () => {
    const resessedParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
    }, new UniqueEntityID(combackParams.participantId));
    const errorMessage = '最少人数のチームがありませんでした。';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(resessedParticipant);
    jest.spyOn(TeamService.prototype, 'getMinimumTeam').mockResolvedValue(undefined);

    await expect(useCase.do(combackParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:復帰:pairService.getMinimumPairByでundefinedの場合、例外が発生する', async () => {
    const resessedParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
    }, new UniqueEntityID(combackParams.participantId));
    const team = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID())],
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    });
    const errorMessage = '最少人数のペアがありませんでした。';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(resessedParticipant);
    jest.spyOn(TeamService.prototype, 'getMinimumTeam').mockResolvedValue(team);
    jest.spyOn(PairService.prototype, 'getMinimumPairBy').mockResolvedValue(undefined);

    await expect(useCase.do(combackParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:脱退:pairRepo.getByParticipantIdでnullの場合、例外が発生する', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));

    const errorMessage = '脱退対象のペアがありませんでした。';
    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(null);

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:脱退:pairRepo.getByParticipantIdで例外が発生した場合、例外が発生する', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const errorMessage = 'Error occurred while getting pair';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:脱退:pairRepo.saveInTransactionで例外が発生した場合、例外が発生する', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const pair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const team = Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [pair.pairId],
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    });
    const errorMessage = 'Error occurred while save pair';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(team);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(pair);
    jest.spyOn(PairService.prototype, 'getMinimumPairBy').mockResolvedValue(pair);
    jest.spyOn(pairRepo, 'saveInTransaction').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:脱退:teamRepo.getByIdでnullの場合、例外が発生する', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const pair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const errorMessage = 'チームがありませんでした。';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(pair);
    jest.spyOn(pairRepo, 'saveInTransaction').mockResolvedValueOnce(pair);
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(null);

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:脱退:teamRepo.getByIdで例外が発生した場合、例外が発生する', async () => {
    const enrolledParticipant = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
    }, new UniqueEntityID(resessParams.participantId));
    const pair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    });
    const errorMessage = 'Error occurred while getting team';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(enrolledParticipant);
    jest.spyOn(pairRepo, 'getByParticipantId').mockResolvedValueOnce(pair);
    jest.spyOn(pairRepo, 'saveInTransaction').mockResolvedValueOnce(pair);
    jest.spyOn(teamRepo, 'getById').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(resessParams)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:participantRepo.saveで例外が発生した場合、例外が発生する', async () => {
    const resessedParticipant2 = Participant.create({
      name: ParticipantName.create({ value: "太郎" }),
      email: ParticipantEmail.create({ value: "test@example.com" }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
    }, new UniqueEntityID(withdrawParams.participantId));
    const errorMessage = 'Error occurred while save participant';

    jest.spyOn(participantRepo, 'getById').mockResolvedValueOnce(resessedParticipant2);
    jest.spyOn(participantRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(withdrawParams)).rejects.toThrow(errorMessage);
  });
});
