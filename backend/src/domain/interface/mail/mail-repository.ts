import { Email } from "src/domain/entity/mail/mail";

export interface IMailRepository {
  send(email: Email): Promise<void>
}