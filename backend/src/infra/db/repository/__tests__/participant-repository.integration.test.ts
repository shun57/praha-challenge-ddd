import { Participant } from 'src/domain/entity/participant/participant';
import { ParticipantId } from 'src/domain/value-object/participant/participant-id';
import { EnrollmentStatusType } from 'src/domain/value-object/participant/participant-enrollment-status';
import { UniqueEntityID } from 'src/shared/domain/unique-entity-id';
import { ParticipantRepository } from '../participant-repository';
import { PrismaService } from '../../prisma.service';

describe('ParticipantRepository', () => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const prisma = jestPrisma.client as PrismaService;
  const participantRepository = new ParticipantRepository(prisma);
  describe('getById', () => {
    it('should return participant by id', async () => {
      const newParticipantData = {
        id: '1',
        name: 'name',
        email: 'test@example.com',
        enrollmentStatus: EnrollmentStatusType.enrolled,
      };

      await prisma.participant.create({ data: newParticipantData });
      const participantId = ParticipantId.create(new UniqueEntityID('1'));
      const result = await participantRepository.getById(participantId);

      // Assert
      expect(result).toBeInstanceOf(Participant);
      expect(result?.participantId.id.toValue()).toBe(newParticipantData.id);
      expect(result?.name.value).toBe(newParticipantData.name);
      expect(result?.email.value).toBe(newParticipantData.email);
      expect(result?.enrollmentStatus.value).toBe(newParticipantData.enrollmentStatus);
    });

    it('should return null for non-existent participant', async () => {
      const participantId = ParticipantId.create(new UniqueEntityID('2'));
      const result = await participantRepository.getById(participantId);
      expect(result).toBeNull();
    });
  });
});
