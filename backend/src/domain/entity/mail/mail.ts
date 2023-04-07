export class Email {
  private to: string
  private from: string
  private subject: string
  private body: string

  public constructor(props: { to: string; from: string, subject: string; body: string }) {
    const { to, from, subject, body } = props
    this.to = to
    this.from = from
    this.subject = subject
    this.body = body
  }

  public getAllProperties() {
    return {
      to: this.to,
      from: this.from,
      subject: this.subject,
      body: this.body
    }
  }
}
