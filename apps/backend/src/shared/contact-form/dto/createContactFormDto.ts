import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  MaxLength,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  IsNumberString,
} from "class-validator";

export class CreateContactFormDto {
  @MaxLength(50, { message: "First Name size should be less than 50" })
  @MinLength(2, { message: "First Name size should be greater than 1" })
  @IsString({ message: "First Name should be a string" })
  @IsNotEmpty({ message: "First Name cannot be empty" })
  @ApiProperty({ type: String })
  firstName: string;

  @MaxLength(50, { message: "Last Name size should be less than 50" })
  @MinLength(2, { message: "Last Name size should be greater than 1" })
  @IsString({ message: "Last Name should be a string" })
  @IsNotEmpty({ message: "Last Name cannot be empty" })
  @ApiProperty({ type: String })
  lastName: string;

  @Matches(
    /^[^<>()[\]?"'|+=/{}\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: "Email format is not correct" },
  )
  @IsNotEmpty({ message: "Email cannot be empty" })
  @ApiProperty()
  email: string;

  @IsNumberString()
  @MinLength(7)
  @MaxLength(13)
  @IsOptional()
  @ApiProperty()
  phone: string;

  @MaxLength(500, { message: "Message size should be less than 500" })
  @MinLength(3, { message: "Message size should be greater than 3" })
  @IsString({ message: "Message should be a string" })
  @IsNotEmpty({ message: "Message cannot be empty" })
  @ApiProperty({ type: String })
  message: string;
}
