import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase';
import { ConstantTokens } from 'src/shared/constants';
import { ITeamQS } from 'src/app/team/query-service-interface/team-qs';

describe('do', () => {
  let useCase: GetAllTeamsUseCase;
  let teamQS: ITeamQS;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTeamsUseCase,
        {
          provide: ConstantTokens.REPOSITORY_QS,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllTeamsUseCase>(GetAllTeamsUseCase);
    teamQS = module.get<ITeamQS>(ConstantTokens.REPOSITORY_QS);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    const expectedTeams = [{ id: '1', name: '001' }, { id: '2', name: '002' }];
    jest.spyOn(teamQS, 'getAll').mockResolvedValueOnce(expectedTeams);

    const pairs = await useCase.do();

    expect(pairs).toEqual(expectedTeams);
  });

  it('[異常系]:teamQS.getAllで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting teams';
    jest.spyOn(teamQS, 'getAll').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do()).rejects.toThrow(errorMessage);
  });
});
