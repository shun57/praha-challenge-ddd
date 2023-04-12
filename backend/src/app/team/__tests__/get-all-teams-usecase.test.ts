import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTeamsUseCase } from 'src/app/team/get-all-teams-usecase';
import { Team } from 'src/domain/entity/team/team';
import { ITeamRepository } from 'src/domain/interface/team/team-repository';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamName } from 'src/domain/value-object/team/team-name';
import { ConstantTokens } from 'src/shared/constants';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';

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

  it('[正常系]:例外が発生しないこと', async () => {
    const expectedTeams = [Team.create({
      name: TeamName.create({ value: "123" }),
      pairIds: [PairId.create(new UniqueEntityID())],
      participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
    })]
    jest.spyOn(teamRepo, 'getAll').mockResolvedValueOnce(expectedTeams);

    const pairs = await useCase.do();

    expect(pairs).toEqual(expectedTeams);
  });

  it('[異常系]:teamRepo.getAllで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting teams';
    jest.spyOn(teamRepo, 'getAll').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do()).rejects.toThrow(errorMessage);
  });
});
