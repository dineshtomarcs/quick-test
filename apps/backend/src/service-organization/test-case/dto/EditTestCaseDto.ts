import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, MaxLength, IsNotEmpty } from "class-validator";
import { ExecutionPriority } from "../../../common/enums/execution-priority";

export class EditTestCaseDto {
  @MaxLength(200, { message: "Title max size can be 200" })
  @IsNotEmpty({ message: "Title cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  title: string;

  @MaxLength(3000, { message: "Preconditions max size can be 3000" })
  @IsNotEmpty({ message: "Preconditions cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly preconditions: string;

  @MaxLength(3000, { message: "Steps max size can be 3000" })
  @IsNotEmpty({ message: "Steps cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly steps: string;

  @MaxLength(3000, { message: "Expected results max size can be 3000" })
  @IsNotEmpty({ message: "Expected cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly expectedResults: string;

  @IsNotEmpty({ message: "executionPriority cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional()
  readonly executionPriority: () => ExecutionPriority;
}

class sectionId {
  @ApiProperty()
  sectionId: string;
}
class testCaseId {
  @ApiProperty()
  testCaseId: string;
}
export class editTestCaseSwagger {
  @ApiProperty()
  testCase: EditTestCaseDto;

  @ApiProperty()
  sectionId: sectionId;

  @ApiProperty()
  testCaseId: testCaseId;
}
