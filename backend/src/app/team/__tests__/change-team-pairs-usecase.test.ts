import { Test, TestingModule } from '@nestjs/testing';
import { Team } from 'src/domain/entity/team/team';
import { ITeamRepository } from 'src/domain/interface/team/team-repository';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamName } from 'src/domain/value-object/team/team-name';
import { ConstantTokens } from 'src/shared/constants';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { ChangeTeamPairsUseCase } from '../change-team-pairs-usecase';
import { IPairRepository } from 'src/domain/interface/pair/pair-repository';
import { Pair } from 'src/domain/entity/pair/pair';
import { PairName } from 'src/domain/value-object/pair/pair-name';
import { TeamId } from 'src/domain/value-object/team/team-id';

describe('do', () => {
  let useCase: ChangeTeamPairsUseCase;
  let teamRepo: ITeamRepository;
  let pairRepo: IPairRepository;
  // テストデータ
  let params = { teamId: "1", newPairIds: ["1", "2", "3"] };
  let team = Team.create({
    name: TeamName.create({ value: "123" }),
    pairIds: [PairId.create(new UniqueEntityID())],
    participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())]
  })
  const pairs = [Pair.create({
    name: PairName.create({ value: "a" }),
    teamId: TeamId.create(new UniqueEntityID()),
    participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
  })]
  const inValidPairs = [Pair.create({
    name: PairName.create({ value: "a" }),
    teamId: TeamId.create(new UniqueEntityID()),
    participantIds: [ParticipantId.create(new UniqueEntityID()), ParticipantId.create(new UniqueEntityID())],
  })]


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangeTeamPairsUseCase,
        {
          provide: ConstantTokens.TEAM_REPOSITORY,
          useValue: {
            getById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: ConstantTokens.PAIR_REPOSITORY,
          useValue: {
            getByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ChangeTeamPairsUseCase>(ChangeTeamPairsUseCase);
    teamRepo = module.get<ITeamRepository>(ConstantTokens.TEAM_REPOSITORY);
    pairRepo = module.get<IPairRepository>(ConstantTokens.PAIR_REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(team);
    jest.spyOn(pairRepo, 'getByIds').mockResolvedValueOnce(pairs);
    jest.spyOn(teamRepo, 'save').mockResolvedValueOnce(team);

    return expect(
      useCase.do(params),
    ).resolves.toBe(undefined)
  });

  it('[異常系]:teamRepo.getByIdでnullの場合、例外が発生する', async () => {
    const errorMessage = '対象のチームが存在しません。';
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(null);

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:teamRepo.getByIdで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting team';
    jest.spyOn(teamRepo, 'getById').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:pairRepo.getByIdsで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting pairs';
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(team);
    jest.spyOn(pairRepo, 'getByIds').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:Team.createでチームメンバーが足りていない場合', async () => {
    const errorMessage = 'チームメンバーが足りていません';
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(team);
    jest.spyOn(pairRepo, 'getByIds').mockResolvedValueOnce(inValidPairs);

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:teamRepo.saveで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while save team';
    jest.spyOn(teamRepo, 'getById').mockResolvedValueOnce(team);
    jest.spyOn(pairRepo, 'getByIds').mockResolvedValueOnce(pairs);
    jest.spyOn(teamRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });
});
