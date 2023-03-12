import { Test, TestingModule } from '@nestjs/testing';
import { UpdateParticipantChallengeProgressUseCase } from 'src/app/participant/update-participant-challenge-progress-usecase';
import { ConstantTokens } from 'src/shared/constants';
import { IParticipantChallengeQS } from 'src/app/participant/query-service-interface/participant-challenge-qs';
import { IParticipantChallengeRepository } from 'src/app/participant/repository-interface/participant-challenge-repository';
import { ParticipantChallengeDTO } from 'src/app/participant/dto/participant-challenge';

describe('do', () => {
  let useCase: UpdateParticipantChallengeProgressUseCase;
  let participantChallengeQS: IParticipantChallengeQS;
  let participantChallengeRepo: IParticipantChallengeRepository;
  const param = { participantId: "1", challengeId: "1", progress: "未着手" }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateParticipantChallengeProgressUseCase,
        {
          provide: ConstantTokens.REPOSITORY_QS_PC,
          useValue: {
            findByParticipantIdAndChallengeId: jest.fn(),
          },
        },
        {
          provide: ConstantTokens.REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<UpdateParticipantChallengeProgressUseCase>(UpdateParticipantChallengeProgressUseCase);
    participantChallengeQS = module.get<IParticipantChallengeQS>(ConstantTokens.REPOSITORY_QS_PC);
    participantChallengeRepo = module.get<IParticipantChallengeRepository>(ConstantTokens.REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    const participantChallengeDTO = new ParticipantChallengeDTO(param)
    jest.spyOn(participantChallengeQS, 'findByParticipantIdAndChallengeId').mockResolvedValueOnce(participantChallengeDTO);
    jest.spyOn(participantChallengeRepo, 'save').mockResolvedValueOnce();

    return expect(
      useCase.do(param),
    ).resolves.toBe(undefined)
  });

  it('[異常系]:participantChallengeQS.findByParticipantIdAndChallengeIdで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting participantChallenge';
    jest.spyOn(participantChallengeQS, 'findByParticipantIdAndChallengeId').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:participantChallengeRepo.saveで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while save participantChallenge';
    const participantChallengeDTO = new ParticipantChallengeDTO(param)
    jest.spyOn(participantChallengeQS, 'findByParticipantIdAndChallengeId').mockResolvedValueOnce(participantChallengeDTO);
    jest.spyOn(participantChallengeRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });
});
