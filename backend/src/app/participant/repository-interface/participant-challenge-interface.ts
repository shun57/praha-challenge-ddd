import { ParticipantChallenge } from "src/domain/entity/participant/participant-challenge";

export interface ParticipantChallengeRepository {
  save(challenge: ParticipantChallenge): Promise<ParticipantChallenge>
}