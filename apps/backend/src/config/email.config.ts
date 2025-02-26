import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import { registerAs } from "@nestjs/config";

import { EmailConfig } from "./config.type";

import validateConfig from "../_helpers/validate-config";

class environmentVariablesValidator {
  @IsOptional()
  @IsString()
  SENDGRID_SERVER: string;

  @IsOptional()
  @IsString()
  SENDGRID_USERNAME: string;

  @IsOptional()
  @IsString()
  SENDGRID_KEY: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(65533)
  SENDGRID_PORT: number;

  @IsOptional()
  @IsEmail()
  SENDGRID_EMAIL: string;
}

export default registerAs<EmailConfig>("email", () => {
  validateConfig(process.env, environmentVariablesValidator);

  return {
    serverName: process.env.SENDGRID_SERVER,

    userName: process.env.SENDGRID_USERNAME,

    key: process.env.SENDGRID_KEY,

    port: process.env.SENDGRID_PORT
      ? parseInt(process.env.SENDGRID_PORT, 10)
      : 465,

    defaultEmail: process.env.SENDGRID_EMAIL,

    secure: process.env.MAIL_SECURE === "true",

    emailVerifyTokenExpirationTime: process.env
      .EMAIL_VERIFY_TOKEN_EXPIRATION_TIME_MINUTES
      ? parseInt(process.env.EMAIL_VERIFY_TOKEN_EXPIRATION_TIME_MINUTES, 10)
      : 1440,

    emailVerifyTokenIssuedTime: process.env
      .EMAIL_VERIFY_TOKEN_ISSUED_TIME_MINUTES
      ? parseInt(process.env.EMAIL_VERIFY_TOKEN_ISSUED_TIME_MINUTES, 10)
      : 60,
  };
});
