import { ApiPropertyOptional } from "@nestjs/swagger";
import { TestSuiteDetailDto } from "../../test-suite/dto/TestSuiteDetailDto";
import { MilestoneStatus } from "../../../common/enums/milestone-status";
import { AbstractDto } from "../../../common/dto/AbstractDto";
import { MilestoneEntity } from "../milestone.entity";
import { ProjectDto } from "../../project/dto/ProjectDto";

export class MilestoneDetailsDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  status: () => MilestoneStatus;

  @ApiPropertyOptional()
  startDate: Date;

  @ApiPropertyOptional()
  endDate: Date;

  @ApiPropertyOptional()
  testsuites: TestSuiteDetailDto[];

  @ApiPropertyOptional()
  project: ProjectDto;

  constructor(milestone: MilestoneEntity) {
    super(milestone);
    this.name = milestone.name;
    this.description = milestone.description;
    this.status = milestone.status;
    this.startDate = milestone.startDate;
    this.endDate = milestone.endDate;
    this.testsuites = milestone.testsuites
      ? this.transformTestSuiteToTestDeailsDto(milestone.testsuites)
      : undefined;
    this.project = milestone.project ? milestone.project.toDto() : undefined;
  }

  transformTestSuiteToTestDeailsDto(testSuite: any) {
    const results = [];

    testSuite.forEach((element) =>
      results.push(new TestSuiteDetailDto(element)),
    );
    return results;
  }
}
