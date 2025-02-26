import { Repository } from "typeorm";
import { EntityRepository } from "typeorm/decorator/EntityRepository";

import { SubscriptionStatusEntity } from "../entities/subscriptionStatus.entity";

@EntityRepository(SubscriptionStatusEntity)
export class SubscriptionStatusRepository extends Repository<SubscriptionStatusEntity> {}
