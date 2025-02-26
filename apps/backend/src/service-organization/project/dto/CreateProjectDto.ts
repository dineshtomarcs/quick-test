import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength, IsString } from "class-validator";

export class CreateProjectDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsString({ message: "Name should be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @ApiProperty({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsString({ message: "Description should be a string" })
  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsOptional({ message: "Description for the project(Optional)" })
  @ApiProperty({ type: String })
  readonly description: string;
}
