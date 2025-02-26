import { PdfConfig } from "./config.type";
import { registerAs } from "@nestjs/config";
import { IsNumber, IsOptional, IsString } from "class-validator";
import validateConfig from "../_helpers/validate-config";

class EnvironmentVariablesValidator {
  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_FONT_SIZE_1: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_FONT_SIZE_2: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_FONT_SIZE_3: number;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_1: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_2: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_3: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_4: string;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TITLE_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_LINE_WIDTH: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_LEFT_MARGIN: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TITLE_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_INVOICE_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_INVOICE_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_BILLING_ADDRESS_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_BILLING_ADDRESS_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_PURCHASE_DETAILS_LEFT_MARGIN: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_HEADINGS_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_HEADINGS_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_QUANTITY_LEFT_MARGIN: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_QUANTITY_WIDTH: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_DESCRIPTION_WIDTH: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_DETAILS_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_DETAILS_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TAX_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TAX_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TOTAL_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TOTAL_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_END_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_END_LEFT_MARGIN: number;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE1: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE2: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE3: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE4: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE5: string;

  @IsOptional()
  @IsString()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE6: string;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_TEXT_HEIGHT: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_1_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_2_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_3_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_4_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_5_START: number;

  @IsOptional()
  @IsNumber()
  PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_6_START: number;
}

export default registerAs<PdfConfig>("pdf", () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    fontSize1: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_FONT_SIZE_1),
    fontSize2: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_FONT_SIZE_2),
    fontSize3: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_FONT_SIZE_3),
    fillColor1: process.env.PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_1,
    fillColor2: process.env.PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_2,
    fillColor3: process.env.PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_3,
    fillColor4: process.env.PAYMENT_SUCCESS_INVOICE_PDF_FILL_COLOR_4,
    titleHeight: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TITLE_HEIGHT),
    lineWidth: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_LINE_WIDTH),
    titleLeftMargin: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_LEFT_MARGIN,
    ),
    titleStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TITLE_START),
    invoiceStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_INVOICE_START),
    invoiceHeight: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_INVOICE_HEIGHT,
    ),
    billingAddressHeight: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_BILLING_ADDRESS_HEIGHT,
    ),
    billingAddressStart: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_BILLING_ADDRESS_START,
    ),
    purchaseDetailsLeftMargin: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_PURCHASE_DETAILS_LEFT_MARGIN,
    ),
    headingsHeight: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_HEADINGS_HEIGHT,
    ),
    headingsStart: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_HEADINGS_START,
    ),
    quantityLeftMargin: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_QUANTITY_LEFT_MARGIN,
    ),
    quantityWdith: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_QUANTITY_WIDTH,
    ),
    descriptionWidth: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_DESCRIPTION_WIDTH,
    ),
    detailsHeight: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_DETAILS_HEIGHT,
    ),
    detailsStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_DETAILS_START),
    taxHeight: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TAX_HEIGHT),
    taxStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TAX_START),
    totalHeight: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TOTAL_HEIGHT),
    totalStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TOTAL_START),
    policyHeight: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_HEIGHT),
    policyStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_START),
    endStart: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_END_START),
    endLeftMargin: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_END_LEFT_MARGIN,
    ),
    policyLine1: process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE1,
    policyLine2: process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE2,
    policyLine3: process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE3,
    policyLine4: process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE4,
    policyLine5: process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE5,
    policyLine6: process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE6,
    textHeight: Number(process.env.PAYMENT_SUCCESS_INVOICE_PDF_TEXT_HEIGHT),
    policyLine1Start: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_1_START,
    ),
    policyLine2Start: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_2_START,
    ),
    policyLine3Start: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_3_START,
    ),
    policyLine4Start: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_4_START,
    ),
    policyLine5Start: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_5_START,
    ),
    policyLine6Start: Number(
      process.env.PAYMENT_SUCCESS_INVOICE_PDF_POLICY_LINE_6_START,
    ),
  };
});
