import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateOrganizationDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @MinLength(2, { message: "Name size should be greater than 1" })
  @IsString({ message: "Name should be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @ApiProperty({ type: String })
  name: string;
}
