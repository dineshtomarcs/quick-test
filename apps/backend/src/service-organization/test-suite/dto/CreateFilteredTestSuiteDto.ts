import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  MaxLength,
  IsUUID,
  IsArray,
} from "class-validator";

export class CreateFilteredTestSuiteDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @ApiProperty({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  description: string;

  @IsUUID(4, { message: "Assigned to should be an uuid" })
  @IsNotEmpty({ message: "Assigned to cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  assignTo: string;

  @IsUUID(4, { message: "Milestone should be an uuid" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  milestone: string;

  @IsUUID(4, { message: "Section id should be an uuid", each: true })
  @ApiProperty({ type: Array })
  sectionIds: string[];

  @IsArray({ message: "testCaseIds must be an array" })
  @IsNotEmpty({ message: "testCaseIds cannot be empty" })
  @ApiProperty({ type: Array })
  testCaseIds: string[];
}

export class CreateFilteredTestSuiteSwagger {
  @ApiProperty()
  testSuite: CreateFilteredTestSuiteDto;
}
