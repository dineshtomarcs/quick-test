import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class UserEmailVerifyDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: "Email cannot be empty" })
  email: string;
}
