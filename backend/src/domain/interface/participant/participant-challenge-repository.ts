import { ParticipantChallenge } from "src/domain/entity/participant/participant-challenge";

export interface IParticipantChallengeRepository {
  save(challenge: ParticipantChallenge): Promise<void>
}