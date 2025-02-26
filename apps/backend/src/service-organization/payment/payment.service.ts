import Stripe from "stripe";
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { UserReadService } from "../../service-users/user/services/read.service";
import { UserEntity } from "../../service-users/user/user.entity";
import { OrganizationService } from "../organization/organization.service";
import { CreateSubscriptionDto } from "./dto/CreateSubscriptionDto";
import { CreateSubscriptionStatusDto } from "./dto/CreateSubscriptionStatusDto";
import { SubscriptionService } from "./subscription.service";
import { SubscriptionStatusService } from "./subscriptionStatus.service";
import { ConfigService } from "@nestjs/config";
import { AllConfigType } from "src/config/config.type";

interface CustomerDetails {
  id: string;
  email: string;
}

@Injectable()
export class PaymentService {
  private stripe: Stripe;
  private webUrl: string;

  constructor(
    public readonly configService: ConfigService<AllConfigType>,
    public readonly organizationService: OrganizationService,
    public readonly userReadService: UserReadService,
    public readonly subscriptionService: SubscriptionService,
    public readonly subscriptionStatusService: SubscriptionStatusService,
    public readonly moduleRef: ModuleRef,
  ) {
    this.stripe = new Stripe(
      this.configService.getOrThrow("stripe.stripeSecerectKey", {
        infer: true,
      }),
      { apiVersion: null },
    );
    this.webUrl = this.configService.get("app.webUrl", { infer: true });
  }

  /**
   * Internal method to get a price
   */
  async findprices() {
    const stripePriceId = this.configService.get("stripe.stripePriceId", {
      infer: true,
    });
    const price = await this.stripe.prices.retrieve(stripePriceId);
    if (!price) {
      throw new NotFoundException("translations.PRICES_NOT_FOUND");
    }
    return price;
  }

  /**
   * Internal method to create new subscription for customer
   */
  async createCheckoutsession(user: UserEntity): Promise<string> {
    if (
      user.organization.subscriptionStatus === OrgSubscriptionStatus.active ||
      user.organization.subscriptionStatus ===
        OrgSubscriptionStatus.cancelAtPeriodEnd
    ) {
      throw new BadRequestException("translations.ALREADY_SUBSCRIBED");
    }

    const priceId = this.configService.get("stripe.stripePriceId", {
      infer: true,
    });
    const session = await this.stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        organizationId: user.organization_id,
      },

      customer_email: user.email,
      success_url: `${this.webUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.webUrl}/cancel`,
    });
    return session.url;
  }

  /**
   * Internal method to integrate the customer portal
   */

  async createCustomerPortalSession(user: UserEntity): Promise<string> {
    const domainURL = `${this.webUrl}`;
    const customerSearchResult = await this.stripe.customers.list({
      email: user.email,
    });
    if (!customerSearchResult?.data?.length) {
      throw new NotFoundException("translations.CUSTOMER_NOT_FOUND");
    }
    const customerId = customerSearchResult?.data[0]?.id;
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: customerId,

      return_url: `${domainURL}/manage-success`,
    });

    return portalSession.url;
  }

  /**
   * Extract event from stripe webhooks
   */

  async handleWebhookEvents(payLoad: any, signature: string): Promise<boolean> {
    const endPointSecret = this.configService.get(
      "stripe.stripeEndPointSecret",
      { infer: true },
    );
    let event;

    event = this.stripe.webhooks.constructEvent(
      payLoad,
      signature,
      endPointSecret,
    );

    switch (event.type) {
      case "customer.created":
        const customer = event.data.object;
        const user = await this.userReadService.findUserByEmail(customer.email);
        await this.organizationService.updateStripeCustomer(
          user.organization_id,
          customer.id,
        );
        break;

      case "customer.subscription.created": {
        const subscription = event.data.object;
        const customerResponse = await this.stripe.customers.retrieve(
          subscription.customer,
        );
        const customer = customerResponse as unknown as CustomerDetails;
        const user = await this.userReadService.findUserByEmail(customer.email);

        const subscriptionDto: CreateSubscriptionDto = {
          customerId: subscription.customer,
          orgId: user.organization_id,
          subscriptionId: subscription.id,
          is_successful: true,
        };
        await this.subscriptionService.addSubscription(subscriptionDto);

        break;
      }
      case "customer.subscription.deleted": {
        const unsubscribe = event.data.object;
        const customerResponse = await this.stripe.customers.retrieve(
          unsubscribe.customer,
        );
        const customer = customerResponse as unknown as CustomerDetails;
        const user = await this.userReadService.findUserByEmail(customer.email);
        const subscriptionStatusDto: CreateSubscriptionStatusDto = {
          customerId: customerResponse.id,
          orgId: user.organization_id,
          subscriptionId: unsubscribe.id,
          is_active: false,
          is_cancelled: true,
        };

        await this.subscriptionStatusService.createSubscriptionStatus(
          subscriptionStatusDto,
        );
        await this.organizationService.updateOrgSubscriptionStatus(
          user.organization_id,
          OrgSubscriptionStatus.cancelled,
        );
        break;
      }
      case "customer.subscription.updated": {
        const resubscribe = event.data.object;
        const customerResponse = await this.stripe.customers.retrieve(
          resubscribe.customer,
        );
        const customer = customerResponse as unknown as CustomerDetails;
        const user = await this.userReadService.findUserByEmail(customer.email);
        const subscriptionStatusDto: CreateSubscriptionStatusDto = {
          customerId: customerResponse.id,
          orgId: user.organization_id,
          subscriptionId: resubscribe.id,
          is_active: !resubscribe.cancel_at_period_end,
          is_cancelled: resubscribe.cancel_at_period_end,
        };

        await this.subscriptionStatusService.createSubscriptionStatus(
          subscriptionStatusDto,
        );
        const action = resubscribe.cancel_at_period_end
          ? OrgSubscriptionStatus.cancelAtPeriodEnd
          : OrgSubscriptionStatus.active;
        await this.organizationService.updateOrgSubscriptionStatus(
          user.organization_id,
          action,
        );

        break;
      }
    }

    return true;
  }
}
