import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  IsNumberString,
  IsEmail,
  IsStrongPassword,
} from "class-validator";

export class UserRegisterDto {
  @MaxLength(50, { message: "First Name max size can be 50" })
  @MinLength(2, { message: "First Name size should be greater than 1" })
  @IsString({ message: "First Name should be a string" })
  @IsNotEmpty({ message: "First Name cannot be empty" })
  @ApiProperty()
  firstName: string;

  @MaxLength(50, { message: "Last Name max size can be 50" })
  @MinLength(2, { message: "Last Name size should be greater than 1" })
  @IsString({ message: "Last Name should be a string" })
  @IsOptional()
  @ApiProperty()
  lastName: string;

  @MaxLength(200, { message: "City size can be 200" })
  @MinLength(2, { message: "City size should be greater than 1" })
  @IsString({ message: "City should be a string" })
  @IsOptional()
  @ApiProperty()
  city: string;

  @MaxLength(200, { message: "State size can be 200" })
  @MinLength(2, { message: "State size should be greater than 1" })
  @IsString({ message: "State should be a string" })
  @IsOptional()
  @ApiProperty()
  state: string;

  @MaxLength(200, { message: "Country size can be 200" })
  @MinLength(2, { message: "Country size should be greater than 1" })
  @IsString({ message: "Country should be a string" })
  @IsOptional()
  @ApiProperty()
  country: string;

  @MaxLength(50, { message: "Postal code max size can be 50" })
  @MinLength(3, { message: "Postal code size should be greater than 2" })
  @IsString({ message: "Postal code should be a string" })
  @IsOptional()
  @ApiProperty()
  postalCode: string;

  @MaxLength(200, { message: "Address 1 max size can be 200" })
  @MinLength(2, { message: "Address 1 size should be greater than 1" })
  @IsString({ message: "Address 1 should be a string" })
  @IsOptional()
  @ApiProperty()
  address1: string;

  @MaxLength(200, { message: "Address 2 max size can be 200" })
  @MinLength(2, { message: "Address 2 size should be greater than 1" })
  @IsString({ message: "Address 2 should be a string" })
  @IsOptional()
  @ApiProperty()
  address2: string;

  @IsEmail()
  @IsNotEmpty({ message: "Email cannot be empty" })
  @ApiProperty({ example: "abc@xyz.pqr" })
  email: string;

  @MaxLength(200, { message: "Title max size can be 200" })
  @IsString({ message: "Title should be a string" })
  @IsOptional()
  @ApiProperty()
  title: string;

  @IsStrongPassword({}, { message: "password must be a strong password" })
  @IsNotEmpty({ message: "Password cannot be empty" })
  @ApiProperty({ minLength: 8, example: "Qwerty123@" })
  readonly password: string;

  @IsNumberString({}, { message: "phone must be a number" })
  @MinLength(7)
  @MaxLength(13)
  @IsOptional()
  @ApiProperty({
    example: "0987654321",
  })
  phone: string;
}

export class useregisterSwagger {
  @ApiProperty()
  user: UserRegisterDto;

  @ApiProperty()
  organization: string;
}

export class adminRegisterSwagger {
  @ApiProperty()
  user: UserRegisterDto;
}
