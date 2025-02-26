import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateSectionDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsString({ message: "Name should be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @ApiProperty({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsString({ message: "Description should be a string" })
  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  description: string;
}
