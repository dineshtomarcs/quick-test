import { Injectable } from "@nestjs/common";
import { CreateSubscriptionStatusDto } from "./dto/CreateSubscriptionStatusDto";
import { SubscriptionStatusRepository } from "./repositories/subscriptionStatus.repository";

@Injectable()
export class SubscriptionStatusService {
  constructor(
    private readonly subscriptionStatusRepository: SubscriptionStatusRepository,
  ) {}

  async createSubscriptionStatus(
    createsubscriptionStatusDto: CreateSubscriptionStatusDto,
  ): Promise<boolean> {
    const subscriptionStatus = await this.subscriptionStatusRepository.create(
      createsubscriptionStatusDto,
    );
    await this.subscriptionStatusRepository.save(subscriptionStatus);
    return true;
  }
}
