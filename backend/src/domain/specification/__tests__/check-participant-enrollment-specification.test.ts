import { IParticipantRepository } from "src/domain/interface/participant/participant-repository"
import { Participant } from "src/domain/entity/participant/participant"
import { ParticipantName } from "src/domain/value-object/participant/participant-name"
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email"
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"
import { CheckParticipantEnrollmentSpecification } from "../check-participant-enrollment-specification"

jest.mock("src/domain/interface/participant/participant-repository")

describe("CheckParticipantEnrollmentSpecification", () => {
  let checkParticipantEnrollmentSpecification: CheckParticipantEnrollmentSpecification
  let participantRepo: jest.Mocked<IParticipantRepository>

  const participant1 = Participant.create({
    name: ParticipantName.create({ value: "佐藤 太郎" }),
    email: ParticipantEmail.create({ value: "test1@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID())

  const participant2 = Participant.create({
    name: ParticipantName.create({ value: "佐藤 二郎" }),
    email: ParticipantEmail.create({ value: "test2@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID())

  const participant3 = Participant.create({
    name: ParticipantName.create({ value: "佐藤 三郎" }),
    email: ParticipantEmail.create({ value: "test3@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.recess })
  }, new UniqueEntityID())

  beforeEach(() => {
    participantRepo = {
      getByEmail: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
      saveInTransaction: jest.fn(),
      getByIds: jest.fn(),
    }
    checkParticipantEnrollmentSpecification = new CheckParticipantEnrollmentSpecification(participantRepo)
  })

  describe("isEnrolledIn", () => {
    it("参加者全員が在籍中の場合、true", async () => {
      participantRepo.getByIds.mockResolvedValue([participant1, participant2])
      const result = await checkParticipantEnrollmentSpecification.isEnrolledIn([participant1.participantId, participant2.participantId])
      expect(result).toBe(true)
    })

    it("参加者が一人でも在籍中ではない場合、false", async () => {
      participantRepo.getByIds.mockResolvedValue([participant1, participant3])
      const result = await checkParticipantEnrollmentSpecification.isEnrolledIn([participant1.participantId, participant3.participantId])
      expect(result).toBe(false)
    })

    it("参加者が取得できない場合、false", async () => {
      participantRepo.getByIds.mockResolvedValue([])
      const result = await checkParticipantEnrollmentSpecification.isEnrolledIn([])
      expect(result).toBe(false)
    })
  })
})
