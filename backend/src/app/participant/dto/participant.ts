export class ParticipantDTO {
    public readonly id: string
    public readonly name: string
    public readonly email: string
    public readonly enrollmentStatus: string
    public constructor(props: { id: string; name: string; email: string; enrollmentStatus: string; }) {
        const { id, name, email, enrollmentStatus } = props
        this.id = id
        this.name = name
        this.email = email
        this.enrollmentStatus = enrollmentStatus
    }
}