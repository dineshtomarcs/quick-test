import { MinLength, IsNotEmpty } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiPropertyOptional()
  @IsNotEmpty({ message: "Old Password cannot be empty" })
  @MinLength(8, {
    message: "Password should have a minimum of 8 characters.",
  })
  readonly oldPassword: string;

  @ApiPropertyOptional()
  @IsNotEmpty({ message: "New Password cannot be empty" })
  @MinLength(8, {
    message: "Password should have a minimum of 8 characters.",
  })
  readonly newPassword: string;
}
