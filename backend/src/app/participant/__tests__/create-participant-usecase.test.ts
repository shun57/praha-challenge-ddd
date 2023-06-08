import { Test, TestingModule } from '@nestjs/testing';
import { ConstantTokens } from 'src/shared/constants';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { CreateParticipantUseCase } from '../create-participant-usecase';
import { IParticipantRepository } from 'src/domain/interface/participant/participant-repository';
import { ParticipantService } from 'src/domain/service/participant-service';
import { Participant } from 'src/domain/entity/participant/participant';
import { ParticipantName } from 'src/domain/value-object/participant/participant-name';
import { ParticipantEmail } from 'src/domain/value-object/participant/participant-email';
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from 'src/domain/value-object/participant/participant-enrollment-status';

describe('do', () => {
  let useCase: CreateParticipantUseCase;
  let participantRepo: IParticipantRepository;
  const params = { name: "太郎", email: "test@example.com" }
  const participant = Participant.create({
    name: ParticipantName.create({ value: params.name }),
    email: ParticipantEmail.create({ value: params.email }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID())

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateParticipantUseCase,
        {
          provide: ConstantTokens.PARTICIPANT_REPOSITORY,
          useValue: {
            save: jest.fn(),
          },
        },
        ParticipantService,
      ],
    }).compile();

    useCase = module.get<CreateParticipantUseCase>(CreateParticipantUseCase);
    participantRepo = module.get<IParticipantRepository>(ConstantTokens.PARTICIPANT_REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    jest.spyOn(participantRepo, 'save').mockResolvedValueOnce(participant);
    jest.spyOn(ParticipantService.prototype, 'isDuplicateEmailBy').mockResolvedValue(false);


    return expect(
      useCase.do(params),
    ).resolves.toBe(undefined)
  });

  it('[異常系]:participantService.isDuplicateEmailByでメールアドレスが重複した場合、例外が発生する', async () => {
    const errorMessage = 'メールアドレスが重複しています。';
    jest.spyOn(ParticipantService.prototype, 'isDuplicateEmailBy').mockResolvedValue(true);

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:participantRepo.saveで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while save participant';
    jest.spyOn(ParticipantService.prototype, 'isDuplicateEmailBy').mockResolvedValue(false);
    jest.spyOn(participantRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(params)).rejects.toThrow(errorMessage);
  });

});
