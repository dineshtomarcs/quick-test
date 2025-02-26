import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { AuthUserInterceptor } from "../../interceptors/auth-user-interceptor.service";
import { UserEntity } from "../../service-users/user/user.entity";
import { PaymentService } from "./payment.service";
import { AuthGuard } from "../../guards/auth.guard";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permissions } from "../../decorators/permission.decorator";
import { Permission } from "../../common/constants/permissions";

@Controller("payments")
@ApiTags("payments")
@UseInterceptors(AuthUserInterceptor)
@UseFilters(ExceptionResponseFilter)
@ApiBearerAuth()
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /**
   * Internal method to get a price
   */

  @Get("price")
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Finds the price",
  })
  async getPrices(): Promise<ResponseSuccess> {
    const price = await this.paymentService.findprices();
    return new ResponseSuccess("translations.PRICE_DETAILS", {
      price,
    });
  }

  /**
   * Create checkout session for subscription
   */

  @Post("/create-checkout-session")
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.CREATE_CHECKOUT_SESSION)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Creates new checkout session",
  })
  async createCheckoutSessions(
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const sessionUrl = await this.paymentService.createCheckoutsession(user);
    return new ResponseSuccess("translations.CHECKOUT_SESSION_URL", {
      sessionUrl,
    });
  }

  /**
   * Create customerPortal session for subscription
   */

  @Post("/create-portal-session")
  @UseGuards(AuthGuard, PermissionsGuard)
  @Permissions(Permission.CREATE_PORTAL_SESSION)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Creates customer portal session",
  })
  async customerPortal(@AuthUser() user: UserEntity): Promise<ResponseSuccess> {
    const sessionUrl =
      await this.paymentService.createCustomerPortalSession(user);
    return new ResponseSuccess("translations.CUSTOMER_PORTAL_URL", {
      sessionUrl,
    });
  }

  /**
   * Handle stripe webhook events
   */
  @Post("/webhook")
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Handle stripe webhook events",
  })
  async handleInvoiceEvents(@Req() req: Request): Promise<ResponseSuccess> {
    await this.paymentService.handleWebhookEvents(
      req.body,
      req.headers["stripe-signature"],
    );

    return new ResponseSuccess("translations.STRIPE_WEBHOOK_LISTENING", {
      received: true,
    });
  }
}
