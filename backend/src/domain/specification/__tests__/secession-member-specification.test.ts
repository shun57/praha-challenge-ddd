import { IMailRepository } from "src/domain/interface/mail/mail-repository";
import { IPairRepository } from "src/domain/interface/pair/pair-repository";
import { PairService } from "src/domain/service/pair-service";
import { CleanPrismaService } from "src/infra/db/prisma.service";
import { SecessionMemberSpecification } from "../secession-member-specification";
import { Participant } from "src/domain/entity/participant/participant";
import { Team } from "src/domain/entity/team/team";
import { Pair } from "src/domain/entity/pair/pair";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";
import { TeamId } from "src/domain/value-object/team/team-id";
import { PairName } from "src/domain/value-object/pair/pair-name";
import { TeamName } from "src/domain/value-object/team/team-name";
import { ParticipantName } from "src/domain/value-object/participant/participant-name";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status";

jest.mock("src/domain/interface/pair/pair-repository");
jest.mock("src/domain/interface/mail/mail-repository");
jest.mock("src/domain/service/pair-service");

describe("SecessionMemberSpecification", () => {
  let pairRepo: jest.Mocked<IPairRepository>;
  let mailRepo: jest.Mocked<IMailRepository>;
  let pairService: PairService;
  let prisma: CleanPrismaService;
  let secessionMemberSpecification: SecessionMemberSpecification;

  beforeEach(() => {
    pairRepo = {
      getByParticipantId: jest.fn(),
      getByParticipantIds: jest.fn(),
      getByTeamId: jest.fn(),
      getAll: jest.fn(),
      save: jest.fn(),
      saveInTransaction: jest.fn(),
      getById: jest.fn(),
      getByIds: jest.fn(),
      deleteInTransaction: jest.fn()
    };
    mailRepo = {
      send: jest.fn(),
    };
    pairService = new PairService(pairRepo);
    prisma = {} as CleanPrismaService;
    secessionMemberSpecification = new SecessionMemberSpecification(
      pairRepo,
      mailRepo
    );
  });

  const participantIds = [
    ParticipantId.create(new UniqueEntityID("1")),
    ParticipantId.create(new UniqueEntityID("2")),
    ParticipantId.create(new UniqueEntityID("3")),
    ParticipantId.create(new UniqueEntityID("4")),
    ParticipantId.create(new UniqueEntityID("5")),
  ];

  const teamId = TeamId.create(new UniqueEntityID("1"));

  const pairA = Pair.create({
    name: PairName.create({ value: "a" }),
    teamId: teamId,
    participantIds: [participantIds[0]!, participantIds[1]!]
  }, new UniqueEntityID());

  const pairB = Pair.create({
    name: PairName.create({ value: "b" }),
    teamId: teamId,
    participantIds: [participantIds[2]!, participantIds[3]!, participantIds[4]!]
  }, new UniqueEntityID());

  const team = Team.create({
    name: TeamName.create({ value: "123" }),
    pairIds: [pairA.pairId, pairB.pairId],
    participantIds: participantIds
  }, teamId.id);

  const withdrawParticipant = Participant.create({
    name: ParticipantName.create({ value: "佐藤 太郎" }),
    email: ParticipantEmail.create({ value: "test@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID());

  const participant1 = Participant.create({
    name: ParticipantName.create({ value: "佐藤 太郎" }),
    email: ParticipantEmail.create({ value: "test1@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID());

  const participant2 = Participant.create({
    name: ParticipantName.create({ value: "佐藤 二郎" }),
    email: ParticipantEmail.create({ value: "test2@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID());

  describe("sendAlertMailToAdminerIfTeamMemberNotFilled", () => {
    it("チームの参加者数が満たさなくなった場合にアラートメールを送る", async () => {
      await secessionMemberSpecification.sendAlertMailToAdminerIfTeamMemberNotFilled(
        withdrawParticipant,
        team,
        [participant1, participant2]
      );
      expect(mailRepo.send).toHaveBeenCalledTimes(1);
    });
  });

  describe("moveAnotherMinPairIfPairMemberNotFilled", () => {
    const currentPair = Pair.create({
      name: PairName.create({ value: "a" }),
      teamId: teamId,
      participantIds: [participantIds[0]!, participantIds[1]!]
    }, new UniqueEntityID());

    it("ペアが参加者人数を満たさなくなった場合、他チームの最少人数ペアに参加者を移動する", async () => {
      const minPair = Pair.create({
        name: PairName.create({ value: "m" }),
        teamId: teamId,
        participantIds: [participantIds[2]!, participantIds[3]!]
      }, new UniqueEntityID())

      await secessionMemberSpecification.moveAnotherMinPairIfPairMemberNotFilled(
        minPair,
        currentPair,
        withdrawParticipant,
        prisma
      );

      expect(pairRepo.deleteInTransaction).toHaveBeenCalledWith(currentPair, prisma);
      expect(pairRepo.saveInTransaction).toHaveBeenCalledWith(minPair, prisma);
    });

    it("合流先のペアがない場合は、アラートメールを送信する", async () => {
      await secessionMemberSpecification.moveAnotherMinPairIfPairMemberNotFilled(
        undefined,
        currentPair,
        withdrawParticipant,
        prisma
      );

      expect(mailRepo.send).toHaveBeenCalledTimes(1)
      expect(pairRepo.deleteInTransaction).toHaveBeenCalledTimes(0);
      expect(pairRepo.saveInTransaction).toHaveBeenCalledTimes(0);
    });
  });
});