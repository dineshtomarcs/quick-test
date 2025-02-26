import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { SubscriptionService } from "./subscription.service";

const mockedSubscriptionService = () => ({
  addSubscription: jest.fn(),
});

const mockedSubscription: any = {
  id: "3e61d32e-130d-4019-9287-e8681fb67607",
  name: "Subscription 1",
};

describe("SubscriptionService", () => {
  let subscriptionService: SubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: SubscriptionService,
          useFactory: mockedSubscriptionService,
        },
      ],
    }).compile();

    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
  });

  /**
   * Add subscription
   */

  describe("addSubscription", () => {
    it("should add a subscription", async () => {
      mocked(subscriptionService.addSubscription).mockImplementation(() =>
        Promise.resolve(mockedSubscription as unknown as true),
      );
      expect(
        await subscriptionService.addSubscription(mockedSubscription),
      ).toBe(mockedSubscription);
    });

    it("should return error if add subscription fails", async () => {
      mocked(subscriptionService.addSubscription).mockImplementation(() =>
        Promise.reject(new Error("createSubscription Fails")),
      );
      expect(
        subscriptionService.addSubscription(mockedSubscription),
      ).rejects.toThrow("createSubscription Fails");
    });
  });
});
