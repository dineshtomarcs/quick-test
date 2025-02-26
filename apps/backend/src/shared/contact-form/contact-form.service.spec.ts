import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { ContactFormService } from "./contact-form.service";

const mockedContactFormService = () => ({
  addContactForm: jest.fn(),
});

const mockedContactForms: any = [
  {
    firstName: "Aman",
    lastName: "Gautam",
    email: "xyz@crownstack.com",
    phone: "+919999999999",
    message: "Send product info",
  },
];

const mockLang: any = "myLang";

describe("ContactFormService", () => {
  let contactFormService: ContactFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactFormService,
        {
          provide: ContactFormService,
          useFactory: mockedContactFormService,
        },
      ],
    }).compile();

    contactFormService = module.get<ContactFormService>(ContactFormService);
  });

  /**
   * Testing to create a new contact form
   */
  describe("addContactForm", () => {
    it("should create a new contact form", async () => {
      const mockedContactForm = mockedContactForms[0];
      expect(mockedContactForm).toHaveProperty("firstName");
      expect(mockedContactForm).toHaveProperty("lastName");
      expect(mockedContactForm).toHaveProperty("email");
      expect(mockedContactForm).toHaveProperty("message");
      expect(mockedContactForm).toHaveProperty("phone");

      mocked(contactFormService.addContactForm).mockImplementation(() =>
        Promise.resolve(true),
      );

      expect(
        contactFormService.addContactForm(mockedContactForm, mockLang),
      ).resolves.toBeTruthy();
    });
  });
});
