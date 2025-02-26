import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionStatusDto {
  @IsString({ message: "customer id should be a string" })
  @IsNotEmpty({ message: "customer id cannot be empty" })
  @ApiProperty({ type: String })
  customerId: string;

  @IsString({ message: "org id should be a string" })
  @IsNotEmpty({ message: "org id cannot be empty" })
  @ApiProperty({ type: String })
  orgId: string;

  @IsString({ message: "subscription id should be a string" })
  @IsNotEmpty({ message: "subscription id cannot be empty" })
  @ApiProperty({ type: String })
  subscriptionId: string;

  @IsString({ message: "is_active should be a boolean" })
  @IsNotEmpty({ message: "is_active cannot be empty" })
  @ApiProperty({ type: Boolean })
  is_active: boolean;

  @IsString({ message: "is_cancelled should be a boolean" })
  @IsNotEmpty({ message: "is_cancelled cannot be empty" })
  @ApiProperty({ type: Boolean })
  is_cancelled: boolean;
}
