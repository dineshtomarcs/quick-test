import { Module, forwardRef } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";
import { UserModule } from "../../service-users/user/user.module";

@Module({
  imports: [forwardRef(() => UserModule), MailerModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
