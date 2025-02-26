import { registerAs } from "@nestjs/config";
import { AwsConfig } from "./config.type";
import { IsOptional, IsString } from "class-validator";
import validateConfig from "../_helpers/validate-config";

export class environmentVariablesValidator {
  @IsOptional()
  @IsString()
  S3_BUCKET_NAME: string;

  @IsOptional()
  @IsString()
  AWS_S3_ACCESS_KEY_ID: string;

  @IsOptional()
  @IsString()
  AWS_S3_SECRET_ACCESS_KEY: string;

  @IsOptional()
  @IsString()
  AWS_S3_REGION: string;

  @IsString()
  @IsOptional()
  DIGITAL_OCEAN_ENDPOINT: string;
}

export default registerAs<AwsConfig>("aws", () => {
  validateConfig(process.env, environmentVariablesValidator);
  return {
    bucketName: process.env.S3_BUCKET_NAME,
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    bucketRegion: process.env.AWS_S3_REGION,
    digitalOceanEndPoint: process.env.DIGITAL_OCEAN_ENDPOINT,
  };
});
