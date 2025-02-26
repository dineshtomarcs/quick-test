import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

import { AbstractDto } from "../../../../common/dto/AbstractDto";

import { TestCaseResultEntity } from "../test-case-result.entity";
import { TestCaseResultStatus } from "../../../../common/enums/test-case-result-status";

import { TestSuiteDto } from "../../dto/TestSuiteDto";
import { DefectEntity } from "../../../defect/defect.entity";

export class TestCaseResultDto extends AbstractDto {
  @IsNotEmpty({ message: "Status cannot be empty" })
  @ApiProperty({ type: String })
  status: TestCaseResultStatus;

  @IsNotEmpty({ message: "Comment cannot be empty" })
  @ApiProperty({ type: String })
  comment: string;

  @IsNotEmpty({ message: "Test Case Title cannot be empty" })
  @ApiProperty({ type: String })
  testCaseTitle: string;

  @IsNotEmpty({ message: "Test Case Precondition cannot be empty" })
  @ApiProperty({ type: String })
  testCasePreconditions: string;

  @IsNotEmpty({ message: "Test Case Steps cannot be empty" })
  @ApiProperty({ type: String })
  testCaseSteps: string;

  @IsNotEmpty({ message: "Test Case Expected Result cannot be empty" })
  @ApiProperty({ type: String })
  testCaseExpectedResults: string;

  @IsNotEmpty({ message: "Section Name cannot be empty" })
  @ApiProperty({ type: String })
  sectionName: string;

  @IsNotEmpty({ message: "Section Description cannot be empty" })
  @ApiProperty({ type: String })
  sectionDescription: string;

  @IsNotEmpty({ message: "Test Case Id cannot be empty" })
  @ApiProperty({ type: Number })
  testCaseId: number;

  @IsNotEmpty({ message: "Test Case Execution Priority cannot be empty" })
  @ApiProperty({ type: String })
  testCaseExecutionPriority: string;

  @ApiPropertyOptional()
  testsuite: TestSuiteDto;

  @ApiProperty({ type: String })
  image: string;

  defect: DefectEntity;

  constructor(result: TestCaseResultEntity) {
    super(result);
    this.status = result.status;
    this.comment = result.comment;
    this.testCaseTitle = result.testCaseTitle;
    this.testCasePreconditions = result.testCasePreconditions;
    this.testCaseSteps = result.testCaseSteps;
    this.testCaseExpectedResults = result.testCaseExpectedResults;
    this.sectionName = result.sectionName;
    this.sectionDescription = result.sectionDescription;
    this.testCaseId = result.testCaseId;
    this.testCaseExecutionPriority = result.testCaseExecutionPriority;
    this.testsuite = result.testsuite ? result.testsuite.toDto() : null;
    this.image = result.image;
    this.defect = result.defect;
  }
}
