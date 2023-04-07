import { Email } from "../mail/mail"
import { Participant } from "../participant/participant"
import { Team } from "./team"



export class TeamMemberNotSatisfiedNotifyMail {
  private readonly FROM_ADDRESS = "from@example.com"
  private readonly TO_ADDRESS = "admin@example.com"
  private readonly SUBJECT = "チームの参加者人数が最低人数を下回りました"

  public buildEmail(team: Team, withdrawParticipant: Participant, currentParticipants: Participant[]): Email {
    const participantNames = currentParticipants.map(participant => {
      return participant.name.value
    })
    const joinNames = participantNames.join(",")
    const body = `対象チームID：${team.teamId.id.toString()}、減った参加者ID：${withdrawParticipant.participantId.id.toString()}、現在の参加者名：${joinNames}`
    return new Email({
      to: this.TO_ADDRESS,
      from: this.FROM_ADDRESS,
      subject: this.SUBJECT,
      body: body,
    })
  }
}