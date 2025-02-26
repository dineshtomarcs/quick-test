import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { SubscriptionStatusService } from "./subscriptionStatus.service";

const mockedSubscriptionStatusService = () => ({
  createSubscriptionStatus: jest.fn(),
});

const mockedSubscriptionStatus: any = {
  cancelled: "cancelled",
};

describe("SubscriptionStatusService", () => {
  let subscriptionStatusService: SubscriptionStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionStatusService,
        {
          provide: SubscriptionStatusService,
          useFactory: mockedSubscriptionStatusService,
        },
      ],
    }).compile();

    subscriptionStatusService = module.get<SubscriptionStatusService>(
      SubscriptionStatusService,
    );
  });

  /**
   * Add subscription status
   */

  describe("createSubscriptionStatus", () => {
    it("should create a subscription status", async () => {
      mocked(
        subscriptionStatusService.createSubscriptionStatus,
      ).mockImplementation(() =>
        Promise.resolve(mockedSubscriptionStatus as unknown as true),
      );
      expect(
        await subscriptionStatusService.createSubscriptionStatus(
          mockedSubscriptionStatus,
        ),
      ).toBe(mockedSubscriptionStatus);
    });

    it("should return error if creating subscription status fails", async () => {
      mocked(
        subscriptionStatusService.createSubscriptionStatus,
      ).mockImplementation(() =>
        Promise.reject(new Error("create subscription status Fails")),
      );
      expect(
        subscriptionStatusService.createSubscriptionStatus(
          mockedSubscriptionStatus,
        ),
      ).rejects.toThrow("create subscription status Fails");
    });
  });
});
