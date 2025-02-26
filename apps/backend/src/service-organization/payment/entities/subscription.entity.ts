import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

import { PaymentAbstractEntity } from "../../../common/payment-abstract.entity";
import { SubscriptionDto } from "../dto/SubscriptionDto";

@Entity({
  name: "subscriptions",
})
@Unique(["subscriptionId"])
export class SubscriptionEntity extends PaymentAbstractEntity<SubscriptionDto> {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  orgId: string;

  @Column()
  customerId: string;

  @Column()
  subscriptionId: string;

  @Column({ type: Boolean })
  is_successful: boolean;

  dtoClass = SubscriptionDto;
}
