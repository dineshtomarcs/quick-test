import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriptionDto {
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

  @IsString({ message: "is_successful should be a boolean" })
  @IsNotEmpty({ message: "is_successful cannot be empty" })
  @ApiProperty({ type: Boolean })
  is_successful: boolean;
}
