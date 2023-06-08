import { Test, TestingModule } from '@nestjs/testing';
import { Pair } from 'src/domain/entity/pair/pair';
import { IPairRepository } from 'src/domain/interface/pair/pair-repository';
import { PairName } from 'src/domain/value-object/pair/pair-name';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { ConstantTokens } from 'src/shared/constants';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { ChangePairParticipantsUseCase } from '../change-pair-participants-usecase';
import { IParticipantRepository } from 'src/domain/interface/participant/participant-repository';
import { CheckParticipantEnrollmentSpecification } from 'src/domain/specification/check-participant-enrollment-specification';
import { PairService } from 'src/domain/service/pair-service';

describe('do', () => {
  let useCase: ChangePairParticipantsUseCase;
  let pairRepo: IPairRepository;
  let participantRepo: IParticipantRepository;
  // テストデータ
  let params = { pairId: "1", newParticipantIds: ["1", "2", "3"] };
  let pair = Pair.create({
    name: PairName.create({ value: "a" }),
    teamId: TeamId.create(new UniqueEntityID()),
    participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePairParticipantsUseCase,
        {
          provide: ConstantTokens.PAIR_REPOSITORY,
          useValue: {
            getById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConstantTokens.PARTICIPANT_REPOSITORY,
          useValue: {
            getByIds: jest.fn(),
          },
        },
        CheckParticipantEnrollmentSpecification,
        PairService,
      ],
    }).compile();

    useCase = module.get<ChangePairParticipantsUseCase>(ChangePairParticipantsUseCase);
    pairRepo = module.get<IPairRepository>(ConstantTokens.PAIR_REPOSITORY);
    participantRepo = module.get<IParticipantRepository>(ConstantTokens.PARTICIPANT_REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    jest.spyOn(pairRepo, 'getById').mockResolvedValueOnce(pair);
    jest.spyOn(CheckParticipantEnrollmentSpecification.prototype, 'isEnrolledIn').mockResolvedValue(true);
    jest.spyOn(PairService.prototype, 'isSameTeamBy').mockResolvedValue(true);
    jest.spyOn(pairRepo, 'save').mockResolvedValueOnce(pair);

    return expect(
      useCase.do(params),
    ).resolves.toBe(undefined)
  });

  it('[異常系]:pairRepo.getByIdでnullの場合、例外が発生する', async () => {
    const errorMessage = '対象のペアが存在しません。';
    jest.spyOn(pairRepo, 'getById').mockResolvedValueOnce(null);

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:いずれかの参加者が在籍中でない場合、例外が発生する', async () => {
    const errorMessage = '参加者が在籍中ではない場合、ペアにできません';

    jest.spyOn(pairRepo, 'getById').mockResolvedValueOnce(pair);
    jest.spyOn(CheckParticipantEnrollmentSpecification.prototype, 'isEnrolledIn').mockResolvedValue(false);

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:いずれかの参加者が同じチームではない場合、例外が発生する', async () => {
    const errorMessage = '同じチームの参加者でなければペアにできません。';

    jest.spyOn(pairRepo, 'getById').mockResolvedValueOnce(pair);
    jest.spyOn(CheckParticipantEnrollmentSpecification.prototype, 'isEnrolledIn').mockResolvedValue(true);
    jest.spyOn(PairService.prototype, 'isSameTeamBy').mockResolvedValue(false);

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:pairRepo.getByIdで例外の場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting pair';
    jest.spyOn(pairRepo, 'getById').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:pairRepo.saveで例外の場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while save pair';
    jest.spyOn(pairRepo, 'getById').mockResolvedValueOnce(pair);
    jest.spyOn(CheckParticipantEnrollmentSpecification.prototype, 'isEnrolledIn').mockResolvedValue(true);
    jest.spyOn(PairService.prototype, 'isSameTeamBy').mockResolvedValue(true);
    jest.spyOn(pairRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });
});
