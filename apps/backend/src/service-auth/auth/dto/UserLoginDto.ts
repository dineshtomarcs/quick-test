import { ApiProperty } from "@nestjs/swagger";
import { Matches, IsNotEmpty } from "class-validator";

export class UserLoginDto {
  @Matches(
    /^[^<>()[\]?"'|+=/{}\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: "Email format is not correct" },
  )
  @IsNotEmpty({ message: "Email cannot be empty" })
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: "Password cannot be empty" })
  @ApiProperty()
  readonly password: string;
}
