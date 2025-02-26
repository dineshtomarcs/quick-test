import { SetMetadata } from "@nestjs/common";
import { OrgSubscriptionStatus } from "../common/enums/org-subscription-status";

export const SubscriptionAuthStatus = (
  ...subscriptionAuthStatus: OrgSubscriptionStatus[]
) => SetMetadata("subscriptionAuthStatus", subscriptionAuthStatus);
