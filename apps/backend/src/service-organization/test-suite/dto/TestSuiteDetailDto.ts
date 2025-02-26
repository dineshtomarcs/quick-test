import { ApiPropertyOptional } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { TestSuiteEntity } from "../test-suite.entity";
import { TestCaseResultDto } from "../test-case-result/dto/TestCaseResultDto";
import { UserEntity } from "../../../service-users/user/user.entity";
import { TestSuiteReportDto } from "../test-report/dto/TestSuiteReportDto";

import { ProjectDto } from "../../project/dto/ProjectDto";

export class TestSuiteDetailDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  assignedTo: UserEntity;

  @ApiPropertyOptional()
  testresults: TestCaseResultDto[];

  @ApiPropertyOptional()
  testReport: TestSuiteReportDto;

  @ApiPropertyOptional()
  project: ProjectDto;

  constructor(testSuite: TestSuiteEntity) {
    super(testSuite);
    this.name = testSuite.name;
    this.description = testSuite.description;
    this.testresults = testSuite.testresults
      ? testSuite.testresults.toDtos()
      : [];
    this.assignedTo = testSuite.assignedTo ? testSuite.assignedTo : null;
    this.testReport = testSuite.testreport
      ? testSuite.testreport.toDto()
      : null;
    this.project = testSuite.project ? testSuite.project.toDto() : null;
  }
}
