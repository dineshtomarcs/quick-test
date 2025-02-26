import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserModule } from "../../service-users/user/user.module";
import { AuthModule } from "../../service-auth/auth/auth.module";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { OrganizationModule } from "../organization/organization.module";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionStatusService } from "./subscriptionStatus.service";
import { SubscriptionStatusRepository } from "./repositories/subscriptionStatus.repository";
import { SubscriptionRepository } from "./repositories/subscription.repository";
import { CronService } from "./cron.service";

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => OrganizationModule),
    TypeOrmModule.forFeature([
      SubscriptionRepository,
      SubscriptionStatusRepository,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    SubscriptionService,
    SubscriptionStatusService,
    CronService,
  ],
  exports: [
    PaymentService,
    SubscriptionService,
    SubscriptionStatusService,
    CronService,
  ],
})
export class PaymentModule {}
