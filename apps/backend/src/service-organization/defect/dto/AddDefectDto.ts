import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional, IsUUID } from "class-validator";

export class AddDefectDto {
  @IsString({ message: "Title should be a string" })
  @IsNotEmpty({ message: "Title cannot be empty" })
  @ApiProperty({ type: String })
  title: string;

  @IsString({ message: "Project id should be a string" })
  @IsNotEmpty({ message: "Project id cannot be empty" })
  @ApiProperty({ type: String })
  projectId: string;

  @IsString({ message: "Issue type id should be a string" })
  @IsNotEmpty({ message: "Issue type id  cannot be empty" })
  @ApiProperty({ type: String })
  issueTypeId: string;

  @IsString({ message: "Assignee id should be a string" })
  @IsNotEmpty({ message: "Assignee id cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  assigneeId: string;

  @IsString({ message: "Sprint id should be a string" })
  @IsNotEmpty({ message: "Sprint id cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  sprintId: string;

  @IsString({ message: "Parent id should be a string" })
  @IsNotEmpty({ message: "Parent id cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  parentId: string;

  @IsString({ message: "Description should be a string" })
  @IsNotEmpty({ message: "Description cannot be empty" })
  @ApiProperty({ type: String })
  description: string;

  @IsUUID(4, { message: "TestCase Id should be a uuid" })
  @IsNotEmpty({ message: "TestCase Id cannot be empty" })
  @IsOptional()
  @ApiProperty({ type: String })
  testCaseId: string;
}
