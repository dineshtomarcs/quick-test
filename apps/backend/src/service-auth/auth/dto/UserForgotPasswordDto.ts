import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail } from "class-validator";

export class UserForgotPasswordDto {
  @IsEmail({}, { message: "must be a valid email" })
  @IsNotEmpty({ message: "Email cannot be empty" })
  @ApiProperty()
  email: string;
}

class password {
  @ApiProperty()
  newPassword: string;
}
class token {
  @ApiProperty()
  token: string;
}
export class userResetPasswordSwagger {
  @ApiProperty()
  password: password;

  @ApiProperty()
  token: token;
}
