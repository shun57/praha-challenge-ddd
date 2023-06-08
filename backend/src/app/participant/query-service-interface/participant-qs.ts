import { ParticipantDTO } from "src/app/participant/dto/participant"
import { ChallengeId } from "src/domain/value-object/challenge/challenge-id"
import { ParticipantChallengeProgress } from "src/domain/value-object/participant/participant-challenge-progress"

export interface IParticipantQS {
  findByChallengesAndProgress(challengeIds: ChallengeId[], progress: string | undefined, limit: number, offset: number): Promise<Page<ParticipantDTO>>
}
