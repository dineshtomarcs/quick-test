import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../common/dto/AbstractDto";
import { SubscriptionEntity } from "../entities/subscription.entity";

export class SubscriptionDto extends AbstractDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerId: string;

  @ApiProperty()
  orgId: string;

  @ApiProperty()
  subscriptionId: string;

  @ApiProperty()
  is_successful: boolean;

  constructor(subscription: SubscriptionEntity) {
    super(subscription);
    this.id = subscription.id;
    this.customerId = subscription.customerId;
    this.orgId = subscription.orgId;
    this.subscriptionId = subscription.subscriptionId;
  }
}
