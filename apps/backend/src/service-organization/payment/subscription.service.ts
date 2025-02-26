import { Injectable } from "@nestjs/common";
import { UserReadService } from "src/service-users/user/services/read.service";
import { CreateSubscriptionDto } from "./dto/CreateSubscriptionDto";
import { SubscriptionRepository } from "./repositories/subscription.repository";

@Injectable()
export class SubscriptionService {
  public userReadService: UserReadService;

  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}

  async addSubscription(
    subscriptionDto: CreateSubscriptionDto,
  ): Promise<boolean> {
    const subscription =
      await this.subscriptionRepository.create(subscriptionDto);
    await this.subscriptionRepository.save(subscription);
    return true;
  }
}
