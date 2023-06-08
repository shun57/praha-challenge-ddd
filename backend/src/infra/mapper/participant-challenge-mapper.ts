import { ParticipantChallenge } from "src/domain/entity/participant/participant-challenge";
import { ParticipantChallengeProgress } from "src/domain/value-object/participant/participant-challenge-progress";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";
import { UniqueEntityID } from "src/shared/domain/unique-entity-id";


export class ParticipantChallengeMapper {
  public static toEntity(param: { participantId: string, challengeId: string, progress: string }): ParticipantChallenge {
    const { participantId, challengeId, progress } = param

    const participantChallengeEntity = ParticipantChallenge.create({
      participantId: ParticipantId.create(new UniqueEntityID(participantId)),
      challengeId: ParticipantId.create(new UniqueEntityID(challengeId)),
      progress: ParticipantChallengeProgress.create({ value: progress }),
    })
    return participantChallengeEntity
  }
}