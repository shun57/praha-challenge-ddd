export class ParticipantDTO {
  public readonly id: string
  public readonly name: string
  public readonly enrollementStatus: string
  public constructor(props: { id: string; name: string; enrollementStatus: string }) {
    const { id, name, enrollementStatus } = props
    this.id = id
    this.name = name
    this.enrollementStatus = enrollementStatus
  }
}

export interface ParticipantRepository {
  getAll(): Promise<ParticipantDTO[]>
}
