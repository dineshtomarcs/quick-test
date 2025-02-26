import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
} from "class-validator";
import { ActivityEntityType } from "../../../../common/enums/activity-entity";

export class CreateActivityDto {
  @IsEnum(() => ActivityEntityType, {
    message: "Entity can be MILESTONE, TESTRUN and TESTCASERESULT only",
  })
  @IsString({ message: "Entity should be a string" })
  @IsNotEmpty({ message: "Entity cannot be empty" })
  @ApiProperty()
  entity: () => ActivityEntityType;

  @IsString({ message: "Name should be a string" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @ApiProperty({ type: String })
  name: string;

  @IsString({ message: "Status should be a string" })
  @IsNotEmpty({ message: "Status cannot be empty" })
  @ApiProperty({ type: String })
  status: string;

  @IsString({ message: "Action should be a string" })
  @IsNotEmpty({ message: "Action cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  action?: string;

  @IsUUID(4, { message: "User id should be of type uuid" })
  @IsNotEmpty({ message: "User id cannot be empty" })
  @ApiProperty({ type: String })
  userId: string;

  @IsUUID(4, { message: "Project id should be of type uuid" })
  @IsNotEmpty({ message: "Project id cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  projectId?: string;

  @IsUUID(4, { message: "Milestone id should be of type uuid" })
  @IsNotEmpty({ message: "Milestone id cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  milestoneId?: string;

  @IsUUID(4, { message: "Test suite id should be of type uuid" })
  @IsNotEmpty({ message: "Test suite id cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  testSuiteId?: string;

  @IsUUID(4, { message: "Testcase result id should be of type uuid" })
  @IsNotEmpty({ message: "Testcase result id cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  testCaseResultId?: string;
}
