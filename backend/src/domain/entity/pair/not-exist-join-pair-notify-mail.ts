import { ParticipantId } from "src/domain/value-object/participant/participant-id"
import { Email } from "../mail/mail"
import { Participant } from "../participant/participant"



export class NotExistJoinPairNotifyMail {
  private readonly FROM_ADDRESS = "from@example.com"
  private readonly TO_ADDRESS = "admin@example.com"
  private readonly SUBJECT = "合流先のペアが見つかりませんでした"

  public buildEmail(withdrawParticipant: Participant, surplusParticipantId: ParticipantId): Email {
    const body = `減った参加者ID：${withdrawParticipant.participantId.id.toString()}、合流先を探す参加者ID：${surplusParticipantId.id.toString()}`
    return new Email({
      to: this.TO_ADDRESS,
      from: this.FROM_ADDRESS,
      subject: this.SUBJECT,
      body: body
    })
  }
}