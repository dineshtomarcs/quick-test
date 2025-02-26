import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
  IsNumber,
  Max,
  Min,
} from "class-validator";

export class UpdateOrganizationMemberDto {
  @MaxLength(50, { message: "First Name max size can be 50" })
  @MinLength(2, { message: "First Name size should be greater than 1" })
  @IsString({ message: "First Name should be a string " })
  @IsNotEmpty({ message: "First Name cannot be empty" })
  @IsOptional()
  @ApiProperty()
  firstName: string;

  @MaxLength(50, { message: "Last Name max size can be 50" })
  @MinLength(2, { message: "Last Name size should be greater than 1" })
  @IsString({ message: "Last Name should be a string" })
  @IsOptional()
  @ApiProperty()
  readonly lastName: string;

  @Matches(
    /^[^<>()[\]?"'|+=/{}\\,;:\%#^\s@\"$&!@]+@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/,
    { message: "Email format is not correct" },
  )
  @IsNotEmpty({ message: "Email cannot be empty" })
  @IsOptional()
  @ApiProperty()
  readonly email: string;

  @IsNotEmpty({ message: "RoleId cannot be empty" })
  @ApiProperty()
  @IsNumber()
  @Min(2, { message: "RoleId minimum value must be more than 1" })
  @Max(4, { message: "RoleId maximum value can be 4" })
  roleId: number;

  @MaxLength(200, { message: "Title max size can be 200" })
  @IsString({ message: "Title should be a string" })
  @IsNotEmpty({ message: "Title cannot be empty" })
  @IsOptional()
  @ApiProperty()
  readonly title: string;
}
