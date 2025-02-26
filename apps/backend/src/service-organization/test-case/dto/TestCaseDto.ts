import { ApiPropertyOptional } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";

import { TestCaseEntity } from "../test-case.entity";

import { SectionDto } from "../section/dto/SectionDto";
import { ExecutionPriority } from "../../../common/enums/execution-priority";

import { UserDto } from "../../../service-users/user/dto/UserDto";
import { DefectEntity } from "../../defect/defect.entity";

export class TestCaseDto extends AbstractDto {
  @ApiPropertyOptional()
  testcaseId: number;

  @ApiPropertyOptional()
  title: string;

  @ApiPropertyOptional()
  preconditions: string;

  @ApiPropertyOptional()
  steps: string;

  @ApiPropertyOptional()
  expectedResults: string;

  @ApiPropertyOptional()
  section: SectionDto;

  @ApiPropertyOptional()
  updatedBy: UserDto;

  @ApiPropertyOptional()
  createdBy: UserDto;

  @ApiPropertyOptional()
  executionPriority: () => ExecutionPriority;

  @ApiPropertyOptional()
  priority: number;

  defect: DefectEntity;

  constructor(testcase: TestCaseEntity) {
    super(testcase);
    this.testcaseId = testcase.testcaseId;
    this.title = testcase.title;
    this.preconditions = testcase.preconditions;
    this.steps = testcase.steps;
    this.expectedResults = testcase.expectedResults;
    this.section = testcase.section ? testcase.section.toDto() : undefined;
    this.createdBy = testcase.createdBy
      ? testcase.createdBy.toDto()
      : undefined;
    this.updatedBy = testcase.updatedBy
      ? testcase.updatedBy.toDto()
      : undefined;
    this.executionPriority = testcase.executionPriority
      ? testcase.executionPriority
      : ExecutionPriority.LOW;
    this.priority = testcase.priority;
    this.defect = testcase?.defect;
  }
}
