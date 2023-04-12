import { Test, TestingModule } from '@nestjs/testing';
import { ConstantTokens } from 'src/shared/constants';
import { SearchParticipantsUseCase } from '../search-participants-usecase';
import { IParticipantQS } from '../query-service-interface/participant-qs';
import { ParticipantDTO } from '../dto/participant';

describe('do', () => {
  let useCase: SearchParticipantsUseCase;
  let participantQS: IParticipantQS;
  // テストデータ
  const params = { challengeIds: ["1", "2"], progress: "未着手", pageNumber: 1 }
  const paging = <Paging>{ totalCount: 5, limit: 10, offset: 0 }
  const participantDtos = [new ParticipantDTO({
    id: "1",
    name: "太郎",
    email: "test@example.com",
    enrollmentStatus: "在籍中"
  })]
  const result = <Page<ParticipantDTO>>{ items: participantDtos, paging: paging }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchParticipantsUseCase,
        {
          provide: ConstantTokens.PARTICIPANT_QS,
          useValue: {
            findByChallengesAndProgress: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<SearchParticipantsUseCase>(SearchParticipantsUseCase);
    participantQS = module.get<IParticipantQS>(ConstantTokens.PARTICIPANT_QS);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    jest.spyOn(participantQS, 'findByChallengesAndProgress').mockResolvedValueOnce(result);

    return expect(
      useCase.do(params),
    ).resolves.toBe(result)
  });

  it('[異常系]:participantQS.findByChallengesAndProgressで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while getting participant';
    jest.spyOn(participantQS, 'findByChallengesAndProgress').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

});
