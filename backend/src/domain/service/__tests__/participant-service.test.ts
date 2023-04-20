import { IParticipantRepository } from "src/domain/interface/participant/participant-repository"
import { ParticipantService } from "../participant-service"
import { Participant } from "src/domain/entity/participant/participant"
import { ParticipantName } from "src/domain/value-object/participant/participant-name"
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email"
import { EnrollmentStatusType, ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status"
import { UniqueEntityID } from "src/shared/domain/unique-entity-id"

jest.mock("src/domain/interface/participant/participant-repository")

describe("ParticipantService", () => {
  let participantService: ParticipantService
  let participantRepo: jest.Mocked<IParticipantRepository>

  const participant = Participant.create({
    name: ParticipantName.create({ value: "佐藤 太郎" }),
    email: ParticipantEmail.create({ value: "test@example.com" }),
    enrollmentStatus: ParticipantEnrollmentStatus.create({ value: EnrollmentStatusType.enrolled })
  }, new UniqueEntityID())

  beforeEach(() => {
    participantRepo = {
      getByEmail: jest.fn(),
      getById: jest.fn(),
      save: jest.fn(),
      saveInTransaction: jest.fn(),
      getByIds: jest.fn(),
    }
    participantService = new ParticipantService(participantRepo)
  })

  describe("isDuplicateEmailBy", () => {
    it("emailが重複している場合、true", async () => {
      participantRepo.getByEmail.mockResolvedValue(participant)
      const result = await participantService.isDuplicateEmailBy(participant)
      expect(result).toBe(true)
    })

    it("emailが重複していない場合、false", async () => {
      participantRepo.getByEmail.mockResolvedValue(null)
      const result = await participantService.isDuplicateEmailBy(participant)
      expect(result).toBe(false)
    })
  })
})
