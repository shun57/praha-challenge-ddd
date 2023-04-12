import { Test, TestingModule } from '@nestjs/testing';
import { GetAllPairsUseCase } from 'src/app/pair/get-all-pairs-usecase';
import { Pair } from 'src/domain/entity/pair/pair';
import { IPairRepository } from 'src/domain/interface/pair/pair-repository';
import { PairName } from 'src/domain/value-object/pair/pair-name';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { ConstantTokens } from 'src/shared/constants';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';

describe('do', () => {
  let useCase: GetAllPairsUseCase;
  let pairRepo: IPairRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllPairsUseCase,
        {
          provide: ConstantTokens.PAIR_REPOSITORY,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllPairsUseCase>(GetAllPairsUseCase);
    pairRepo = module.get<IPairRepository>(ConstantTokens.PAIR_REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    const expectedPairs = [Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: TeamId.create(new UniqueEntityID()),
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
    })]
    jest.spyOn(pairRepo, 'getAll').mockResolvedValueOnce(expectedPairs);

    const pairs = await useCase.do();

    expect(pairs).toEqual(expectedPairs);
  });

  it('[異常系]:pairQS.getAllで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting pairs';
    jest.spyOn(pairRepo, 'getAll').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do()).rejects.toThrow(errorMessage);
  });
});
