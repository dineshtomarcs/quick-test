import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, IsString } from "class-validator";

export class CreateMilestoneDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsString({ message: "Name should be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @ApiProperty({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsString({ message: "Description should be a string" })
  @IsNotEmpty({ message: "Description cannot be empty" })
  @ApiProperty({ type: String })
  readonly description: string;

  @IsNotEmpty({ message: "Start Date cannot be empty" })
  @ApiProperty({ type: Date })
  readonly startDate: Date;

  @IsNotEmpty({ message: "End Date cannot be empty" })
  @ApiProperty({ type: Date })
  readonly endDate: Date;
}
