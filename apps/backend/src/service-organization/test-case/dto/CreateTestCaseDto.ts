import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, IsString, IsOptional } from "class-validator";
import { ExecutionPriority } from "../../../common/enums/execution-priority";

export class CreateTestCaseDto {
  @MaxLength(200, { message: "Title max size can be 200" })
  @IsString({ message: "Title should be a string" })
  @IsNotEmpty({ message: "Title cannot be empty" })
  @ApiProperty({ type: String })
  title: string;

  @MaxLength(3000, { message: "Preconditions max size can be 3000" })
  @IsString({ message: "Preconditions should be a string" })
  @IsNotEmpty({ message: "Preconditions cannot be empty" })
  @ApiProperty({ type: String })
  readonly preconditions: string;

  @MaxLength(3000, { message: "Steps max size can be 3000" })
  @IsString({ message: "Steps should be a string" })
  @IsNotEmpty({ message: "Steps cannot be empty" })
  @ApiProperty({ type: String })
  readonly steps: string;

  @MaxLength(3000, { message: "Expected results max size can be 3000" })
  @IsString({ message: "Expected results should be a string" })
  @IsNotEmpty({ message: "Expected results cannot be empty" })
  @ApiProperty({ type: String })
  readonly expectedResults: string;

  @IsNotEmpty({ message: "executionPriority cannot be empty" })
  @IsOptional()
  @ApiProperty()
  readonly executionPriority: () => ExecutionPriority;
}

export class createTestCaseSwagger {
  @ApiProperty()
  testcase: CreateTestCaseDto;

  @ApiProperty()
  sectionId: string;
}

export class testCaseIdsSwagger {
  @ApiProperty()
  testCaseIds: string[];
}
