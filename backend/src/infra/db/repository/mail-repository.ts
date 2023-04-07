
import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { Email } from 'src/domain/entity/mail/mail'
import { IMailRepository } from 'src/domain/interface/mail/mail-repository'

@Injectable()
export class MailRepository implements IMailRepository {
  public constructor(private readonly mailerService: MailerService) { }

  public async send(email: Email): Promise<void> {
    const mail = email.getAllProperties()
    await this.mailerService.sendMail({
      to: mail.to,
      from: mail.from,
      subject: mail.subject,
      text: mail.body
    })
  }
}