import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { PaymentService } from "./payment.service";

const mockedPaymentService = () => ({
  findActiveProduct: jest.fn(),
  findprices: jest.fn(),
  createCheckoutsession: jest.fn(),
  createCustomerPortalSession: jest.fn(),
});

const mockedPrice: any = {
  id: "3e61d32e-130d-4019-9287-e8681fb67607",
  name: "Price 1",
};

const mockedSession: any = {
  sessionUrl: "http://localhost:3000/paystripe",
};

describe("PaymentService", () => {
  let paymentService: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentService,
          useFactory: mockedPaymentService,
        },
      ],
    }).compile();

    paymentService = module.get<PaymentService>(PaymentService);
  });

  describe("findprices", () => {
    it("should return error for price with this id not found", async () => {
      mocked(paymentService.findprices).mockImplementation(() =>
        Promise.reject(new Error("Price with this id not found")),
      );

      expect(paymentService.findprices()).rejects.toThrow(
        "Price with this id not found",
      );
    });
    it("should find price from Stripe", async () => {
      mocked(paymentService.findprices).mockImplementation(
        async () => await Promise.resolve(mockedPrice),
      );
      expect(await paymentService.findprices()).toMatchObject(mockedPrice);
    });
  });

  describe("createCheckoutsession", () => {
    it("should create a checkout session for payment", async () => {
      mocked(paymentService.createCheckoutsession).mockImplementation(
        async () => await Promise.resolve(mockedSession),
      );
      expect(
        await paymentService.createCheckoutsession(mockedSession.sessionUrl),
      ).toMatchObject(mockedSession);
    });
  });

  describe("createCustomerPortalSession", () => {
    it("should Create a customer portal session ", async () => {
      mocked(paymentService.createCustomerPortalSession).mockImplementation(
        async () => await Promise.resolve(mockedSession),
      );
      expect(
        await paymentService.createCustomerPortalSession(
          mockedSession.sessionUrl,
        ),
      ).toMatchObject(mockedSession);
    });
  });
});
