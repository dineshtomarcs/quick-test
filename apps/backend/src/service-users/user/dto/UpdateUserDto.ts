import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  Matches,
  MinLength,
  MaxLength,
  IsString,
  IsNotEmpty,
  IsIn,
  IsNumberString,
} from "class-validator";
import { ALLOWED_LANGUAGES } from "../../../common/constants/lang";

export class UpdateUserDto {
  @MaxLength(50, { message: "First Name size should be less than 50" })
  //@MinLength(2, { message: "First Name size should be greater than 1" })
  @IsString({ message: "First Name should be a string" })
  @IsNotEmpty({ message: "First Name cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  firstName: string;

  @MaxLength(50, { message: "Last Name size should be less than 50" })
  //@MinLength(2, { message: "Last Name size should be greater than 1" })
  @IsString({ message: "Last Name should be a string" })
  @IsNotEmpty({ message: "Last Name cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  lastName: string;

  @Matches(
    /^[^<>()[\]?"'|+=/{}\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: "Email format is not correct" },
  )
  @IsNotEmpty({ message: "Email cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional()
  readonly email: string;

  @IsNumberString()
  //@MinLength(7)
  @MaxLength(13)
  @IsOptional()
  @ApiPropertyOptional()
  phone: string;

  @MaxLength(200, { message: "City size can be 200" })
  //@MinLength(2, { message: "City size should be greater than 1" })
  @IsString({ message: "City should be a string" })
  @IsOptional()
  @ApiPropertyOptional()
  city: string;

  @MaxLength(200, { message: "State size can be 200" })
  //@MinLength(2, { message: "State size should be greater than 1" })
  @IsString({ message: "State should be a string" })
  @IsOptional()
  @ApiPropertyOptional()
  state: string;

  @MaxLength(200, { message: "Country size can be 200" })
  //@MinLength(2, { message: "Country size should be greater than 1" })
  @IsString({ message: "Country should be a string" })
  @IsOptional()
  @ApiPropertyOptional()
  country: string;

  @MaxLength(50, { message: "Postal code max size can be 50" })
  //@MinLength(3, { message: "Postal code size should be greater than 2" })
  @IsString({ message: "Postal code should be a string" })
  @IsOptional()
  @ApiPropertyOptional()
  postalCode: string;

  @MaxLength(200, { message: "Address 1 max size can be 200" })
  //@MinLength(2, { message: "Address 1 size should be greater than 1" })
  @IsString({ message: "Address 1 should be a string" })
  @IsOptional()
  @ApiPropertyOptional()
  address1: string;

  @MaxLength(200, { message: "Address 2 max size can be 200" })
  //@MinLength(2, { message: "Address 2 size should be greater than 1" })
  @IsString({ message: "Address 2 should be a string" })
  @IsOptional()
  @ApiPropertyOptional()
  address2: string;

  @IsOptional()
  @ApiPropertyOptional()
  @IsIn(ALLOWED_LANGUAGES)
  language: string[];
}

export class UpdateUserSwagger {
  @ApiProperty()
  user: UpdateUserDto;

  @ApiProperty()
  organization: string;
}
