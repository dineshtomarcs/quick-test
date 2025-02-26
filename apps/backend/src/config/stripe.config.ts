import { registerAs } from "@nestjs/config";
import { StripeConfig } from "./config.type";
import { IsOptional, IsString, ValidateIf } from "class-validator";
import validateConfig from "../_helpers/validate-config";

class EnvironmentVariablesValidator {
  @ValidateIf((envValues) => !envValues.STRIPE_SECRET_KEY)
  @IsString()
  STRIPE_SECRET_KEY: string;

  @ValidateIf((envValues) => !envValues.STRIPE_PRICE_ID)
  @IsString()
  STRIPE_PRICE_ID: string;

  @ValidateIf((envValues) => !envValues.STRIPE_END_POINT_SECRET)
  @IsString()
  STRIPE_END_POINT_SECRET: string;

  @IsOptional()
  @IsString()
  STRIPE_MODE: string;

  @IsOptional()
  @IsString()
  STRIPE_PAYMENT_MODE: string;

  @IsOptional()
  @IsString()
  STRIPE_PRODUCT_QUANTITY: string;

  @IsOptional()
  @IsString()
  STRIPE_BILLING_INTERVAL: string;

  @IsOptional()
  @IsString()
  STRIPE_PRODUCT_PRICE: string;

  @IsOptional()
  @IsString()
  STRIPE_PRODUCT_NAME: string;

  @IsOptional()
  @IsString()
  STRIPE_PRODUCT_PRICE_CURRENCY: string;

  @IsOptional()
  @IsString()
  STRIPE_API_VERSION: string;
}

export default registerAs<StripeConfig>("stripe", () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    stripeSecerectKey: process.env.STRIPE_SECRET_KEY,
    stripePriceId: process.env.STRIPE_PRICE_ID,
    stripeMode: process.env.STRIPE_MODE,
    stripePaymentMethod: process.env.STRIPE_PAYMENT_MODE,
    stripeProductQuantity: process.env.STRIPE_PRODUCT_QUANTITY,
    stripeBillingInterval: process.env.STRIPE_BILLING_INTERVAL,
    stripeProductPrice: process.env.STRIPE_PRODUCT_PRICE,
    stripeProductPriceId: process.env.STRIPE_PRICE_ID,
    stripeProductId: process.env.STRIPE_PRODUCT_ID,
    stripeProductName: process.env.STRIPE_PRODUCT_NAME,
    stripeProductPriceCurrency: process.env.STRIPE_PRODUCT_PRICE_CURRENCY,
    stripeEndPointSecret: process.env.STRIPE_END_POINT_SECRET,
    stripeTrialPeriodDays: process.env.STRIPE_TRIAL_PERIOD_DAYS,
    stripeApiVersion: process.env.STRIPE_API_VERSION,
  };
});
