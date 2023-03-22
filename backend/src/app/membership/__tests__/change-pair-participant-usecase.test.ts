import { Test, TestingModule } from '@nestjs/testing';
import { ConstantTokens } from 'src/shared/constants';
import { ChangePairParticipantUseCase } from 'src/app/membership/change-pair-participant-usecase';
import { IMembershipRepository } from 'src/domain/interface/membership/repository-interface/membership-repository';
import { Membership } from 'src/domain/entity/membership/membership';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { TeamId } from 'src/domain/value-object/team/team-id';
import { PairId } from 'src/domain/value-object/pair/pair-id';
import { MembershipEnrollmentStatus } from 'src/domain/value-object/membership/membership-enrollment-status';

describe('do', () => {
  let useCase: ChangePairParticipantUseCase;
  let membershipRepo: IMembershipRepository;

  const param = { membershipId: "12345", newParticipantId: "12345" }

  let membershipEntity = Membership.create({
    participantId: ParticipantId.create(),
    teamId: TeamId.create(),
    pairId: PairId.create(),
    enrollmentStatus: MembershipEnrollmentStatus.create({ value: "在籍中" }),
  }, new UniqueEntityID(param.membershipId))

  let updatedMembershipEntity = Membership.create({
    participantId: membershipEntity.participantId,
    teamId: membershipEntity.teamId,
    pairId: PairId.create(new UniqueEntityID(param.newParticipantId)),
    enrollmentStatus: MembershipEnrollmentStatus.create({ value: "在籍中" }),
  }, membershipEntity.membershipId.id)

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChangePairParticipantUseCase,
        {
          provide: ConstantTokens.REPOSITORY,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get<ChangePairParticipantUseCase>(ChangePairParticipantUseCase);
    membershipRepo = module.get<IMembershipRepository>(ConstantTokens.REPOSITORY);
  });

  it('[正常系]:例外が発生しないこと', async () => {
    jest.spyOn(membershipRepo, 'findById').mockResolvedValueOnce(membershipEntity);
    jest.spyOn(membershipRepo, 'save').mockResolvedValueOnce(updatedMembershipEntity);

    return expect(
      useCase.do(param),
    ).resolves.toBe(undefined)
  });

  it('[異常系]:membershipRepo.findByIdでnullが返った場合、例外が発生する', async () => {
    const errorMessage = '対象の会員が存在しません。';
    jest.spyOn(membershipRepo, 'findById').mockResolvedValueOnce(null);
    jest.spyOn(membershipRepo, 'save').mockResolvedValueOnce(updatedMembershipEntity);

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });

  it('[異常系]:membershipRepo.saveで例外が発生した場合、例外が発生する', async () => {
    const errorMessage = 'Error occurred while save membership';
    jest.spyOn(membershipRepo, 'findById').mockResolvedValueOnce(membershipEntity);
    jest.spyOn(membershipRepo, 'save').mockRejectedValueOnce(new Error(errorMessage));

    await expect(useCase.do(param)).rejects.toThrow(errorMessage);
  });
});
