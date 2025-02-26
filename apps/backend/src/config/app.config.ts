import { registerAs } from "@nestjs/config";
import { AppConfig } from "./config.type";
import validateConfig from "../_helpers/validate-config";

import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

enum Environment {
  Production = "production",
  Test = "test",
  Local = "development",
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  PORT: number;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  TRANSPORT_PORT: number;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  FALLBACK_LANGUAGE: string;

  @IsNumber()
  @IsOptional()
  JWT_EXPIRATION_TIME: number;

  @IsString()
  @IsOptional()
  WEB_URL: string;

  @IsString()
  @IsOptional()
  JWT_SECRET_KEY: string;
}

export default registerAs<AppConfig>("app", () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV,
    webUrl: process.env.WEB_URL,
    port: process.env.PORT
      ? parseInt(process.env.PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.TRANSPORT_PORT, 10)
        : 3001,
    apiPrefix: process.env.API_PREFIX || "v1",
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || "en",
    headerLanguage: process.env.APP_HEADER_LANGUAGE || "x-custom-lang",
    jwtKey: process.env.JWT_SECRET_KEY,
    jwtExpirationTime: parseInt(process.env.JWT_EXPIRATION_TIME),
  };
});
