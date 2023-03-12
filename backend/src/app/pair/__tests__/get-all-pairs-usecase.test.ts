import { Test, TestingModule } from '@nestjs/testing';
import { GetAllPairsUseCase } from "src/app/pair/get-all-pairs-usecase";
import { ConstantTokens } from 'src/shared/constants';
import { IPairQS } from 'src/app/pair/query-service-interface/pair-qs';

describe('do', () => {
  let useCase: GetAllPairsUseCase;
  let pairQS: IPairQS;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllPairsUseCase,
        {
          provide: ConstantTokens.REPOSITORY_QS,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllPairsUseCase>(GetAllPairsUseCase);
    pairQS = module.get<IPairQS>(ConstantTokens.REPOSITORY_QS);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    const expectedPairs = [{ id: '1', name: 'a' }, { id: '2', name: 'b' }];
    jest.spyOn(pairQS, 'getAll').mockResolvedValueOnce(expectedPairs);

    const pairs = await useCase.do();

    expect(pairs).toEqual(expectedPairs);
  });

  it('[異常系]:pairQS.getAllで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting pairs';
    jest.spyOn(pairQS, 'getAll').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do()).rejects.toThrow(errorMessage);
  });
});
