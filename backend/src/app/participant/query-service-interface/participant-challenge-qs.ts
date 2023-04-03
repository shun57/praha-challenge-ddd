import { ChallengeId } from "src/domain/value-object/challenge/challenge-id"
import { ParticipantId } from "src/domain/value-object/participant/participant-id"
import { ParticipantChallengeDTO } from "../dto/participant-challenge"

export interface IParticipantChallengeQS {
  findByParticipantIdAndChallengeId(participantId: ParticipantId, challengeId: ChallengeId): Promise<ParticipantChallengeDTO>
}
