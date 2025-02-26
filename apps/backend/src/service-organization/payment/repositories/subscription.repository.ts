import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";

import { SubscriptionEntity } from "../entities/subscription.entity";

@EntityRepository(SubscriptionEntity)
export class SubscriptionRepository extends Repository<SubscriptionEntity> {}
