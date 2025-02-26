import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength, IsUUID } from "class-validator";

export class CreateTestSuiteDto {
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
}

export class CreateTestSuiteSwagger {
  @ApiProperty()
  testSuite: CreateTestSuiteDto;
}
export class testSuiteIdsSwagger {
  @ApiProperty()
  testSuiteIds: string[];
}
