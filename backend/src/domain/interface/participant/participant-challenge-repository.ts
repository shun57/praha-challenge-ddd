import { ParticipantChallenge } from "src/domain/entity/participant/participant-challenge";
import { ChallengeId } from "src/domain/value-object/challenge/challenge-id";
import { ParticipantId } from "src/domain/value-object/participant/participant-id";

export interface IParticipantChallengeRepository {
  getByParticipantIdAndChallengeId(participantId: ParticipantId, challengeId: ChallengeId): Promise<ParticipantChallenge | null>
  save(challenge: ParticipantChallenge): Promise<void>
}