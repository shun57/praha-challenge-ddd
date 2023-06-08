import { Participant } from "src/domain/entity/participant/participant";
import { ParticipantEmail } from "src/domain/value-object/participant/participant-email";
import { ParticipantEnrollmentStatus } from "src/domain/value-object/participant/participant-enrollment-status";
import { ParticipantName } from "src/domain/value-object/participant/participant-name";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";


export class ParticipantMapper {
  public static toEntity(param: { id: string, name: string, email: string, enrollmentStatus: string }): Participant {
    const { id, name, email, enrollmentStatus } = param
    const participantEntity = Participant.create({
      name: ParticipantName.create({ value: name }),
      email: ParticipantEmail.create({ value: email }),
      enrollmentStatus: ParticipantEnrollmentStatus.create({ value: enrollmentStatus })
    }, new UniqueEntityID(id))

    return participantEntity
  }

  public static toData(participant: Participant): { id: string, name: string, email: string, enrollmentStatus: string } {
    return {
      id: participant.participantId.id.toString(),
      name: participant.name.value,
      email: participant.email.value,
      enrollmentStatus: participant.enrollmentStatus.value
    }
  }
}