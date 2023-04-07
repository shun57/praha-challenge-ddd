import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase';
import { ITeamRepository } from 'src/domain/interface/team/team-repository';
import { ConstantTokens } from 'src/shared/constants';

describe('do', () => {
  let useCase: GetAllTeamsUseCase;
  let teamRepo: ITeamRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTeamsUseCase,
        {
          provide: ConstantTokens.TEAM_REPOSITORY,
          useValue: {
            getAll: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<GetAllTeamsUseCase>(GetAllTeamsUseCase);
    teamRepo = module.get<ITeamRepository>(ConstantTokens.TEAM_REPOSITORY);
  });

  // it('[正常系]:例外が発生しないこと', async () => {
  //   const expectedTeams = [{ id: '1', name: '001' }, { id: '2', name: '002' }];
  //   jest.spyOn(teamRepo, 'getAll').mockResolvedValueOnce(expectedTeams);

  //   const pairs = await useCase.do();

  //   expect(pairs).toEqual(expectedTeams);
  // });

  it('[異常系]:teamQS.getAllで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting teams';
    jest.spyOn(teamRepo, 'getAll').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do()).rejects.toThrow(errorMessage);
  });
});
