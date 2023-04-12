import { Test, TestingModule } from '@nestjs/testing';
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase';
import { ConstantTokens } from 'src/shared/constants';
import { IParticipantChallengeRepository } from 'src/domain/interface/participant/participant-challenge-repository';
import { ParticipantChallenge } from 'src/domain/entity/participant/participant-challenge';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { ChallengeId } from 'src/domain/value-object/challenge/challenge-id';
import { ParticipantChallengeProgress, ProgressType } from 'src/domain/value-object/participant/participant-challenge-progress';

describe('do', () => {
  let useCase: UpdateParticipantChallengeProgressUseCase;
  let participantChallengeRepo: IParticipantChallengeRepository;
  const param = { participantId: "1", challengeId: "1", progress: "未着手" }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateParticipantChallengeProgressUseCase,
        {
          provide: ConstantTokens.PARTICIPANT_CHALLENGE_REPOSITORY,
          useValue: {
            save: jest.fn(),
            getByParticipantIdAndChallengeId: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateParticipantChallengeProgressUseCase>(UpdateParticipantChallengeProgressUseCase);
    participantChallengeRepo = module.get<IParticipantChallengeRepository>(ConstantTokens.PARTICIPANT_CHALLENGE_REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    const participantChallenge = ParticipantChallenge.create({
      participantId: ParticipantId.create(new UniqueEntityID("1")),
      challengeId: ChallengeId.create(new UniqueEntityID("1")),
      progress: ParticipantChallengeProgress.create({ value: ProgressType.untouched }),
    })
    jest.spyOn(participantChallengeRepo, 'getByParticipantIdAndChallengeId').mockResolvedValueOnce(participantChallenge);
    jest.spyOn(participantChallengeRepo, 'save').mockResolvedValueOnce();

    return expect(
      useCase.do(param),
    ).resolves.toBe(undefined)
  });

  it('[異常系]:participantChallengeQS.getByParticipantIdAndChallengeIdで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting participantChallenge';
    jest.spyOn(participantChallengeRepo, 'getByParticipantIdAndChallengeId').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:participantChallengeQS.getByParticipantIdAndChallengeIdでnullの場合、例外が発生する', async () => {
    const errorMessage = '対象課題が見つかりません';
    jest.spyOn(participantChallengeRepo, 'getByParticipantIdAndChallengeId').mockResolvedValueOnce(null);

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:participantChallengeRepo.saveで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while save participantChallenge';
    const participantChallenge = ParticipantChallenge.create({
      participantId: ParticipantId.create(new UniqueEntityID("1")),
      challengeId: ChallengeId.create(new UniqueEntityID("1")),
      progress: ParticipantChallengeProgress.create({ value: ProgressType.untouched }),
    })
    jest.spyOn(participantChallengeRepo, 'getByParticipantIdAndChallengeId').mockResolvedValueOnce(participantChallenge);
    jest.spyOn(participantChallengeRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });

});
