export class ParticipantDTO {
    public readonly id: string
    public readonly name: string
    public readonly email: string
    public constructor(props: { id: string; name: string; email: string; }) {
        const { id, name, email } = props
        this.id = id
        this.name = name
        this.email = email
    }
}