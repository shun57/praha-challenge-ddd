export class ParticipantChallengeDTO {
  public readonly participantId: string
  public readonly challengeId: string
  public readonly progress: string
  public constructor(props: { participantId: string; challengeId: string; progress: string; }) {
    const { participantId, challengeId, progress } = props
    this.participantId = participantId
    this.challengeId = challengeId
    this.progress = progress
  }
}