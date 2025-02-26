import { TestingModule, Test } from "@nestjs/testing";
import { MailerModule, MailerService } from "@nestjs-modules/mailer";
import { EmailService } from "./email.service";

const options = {
  transport: {
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "singhailraviraj@gmail.com",
      pass: "Password1",
    },
  },
};
describe("EmailService", () => {
  let emailService: EmailService;
  let mailerService: MailerService;
  const MockMailerService = () => ({
    sendEmail: jest.fn().mockImplementation(() => Promise.resolve("works?")),
  });
  beforeEach(async () => {
    await Test.createTestingModule({
      providers: [
        {
          name: "MAILER_OPTIONS",
          provide: "MAILER_OPTIONS",
          useValue: options,
        },
        { provide: MailerService, useFactory: MockMailerService },
      ],
    }).compile();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
      imports: [MailerModule.forRoot(options)],
    }).compile();

    mailerService = moduleRef.get<MailerService>(MailerService);
    emailService = moduleRef.get<EmailService>(EmailService);
  });

  it("sendMail", async () => {
    jest.spyOn(emailService, "sendEmail");
    jest
      .spyOn(mailerService, "sendMail")
      .mockImplementation(() => Promise.resolve("mail"));
    await emailService.sendEmail(
      "singhailraviraj@gmail.com",
      [],
      [],
      "test",
      "test",
      {},
    );
    expect(emailService.sendEmail).toBeCalledTimes(1);
  });
});
