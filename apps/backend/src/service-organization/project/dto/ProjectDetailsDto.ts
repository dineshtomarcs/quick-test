import { ApiPropertyOptional } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { ProjectEntity } from "../project.entity";
import { TestCaseDto } from "../../test-case/dto/TestCaseDto";
import { TestSuiteDto } from "../../test-suite/dto/TestSuiteDto";
import { MilestoneDto } from "../../milestone/dto/MilestoneDto";
import { OrganizationDto } from "../../organization/dto/OrganizationDto";

export class ProjectDetailsDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  organization: OrganizationDto;

  @ApiPropertyOptional()
  testcases: TestCaseDto[];

  @ApiPropertyOptional()
  testsuites: TestSuiteDto[];

  @ApiPropertyOptional()
  milestones: MilestoneDto[];

  constructor(project: ProjectEntity) {
    super(project);
    this.name = project.name;
    this.description = project.description;
    this.testcases = project.testcases ? project.testcases.toDtos() : undefined;
    this.testsuites = project.testsuites
      ? project.testsuites.toDtos()
      : undefined;
    this.milestones = project.milestones
      ? project.milestones.toDtos()
      : undefined;
    this.organization = project.organization
      ? project.organization.toDto()
      : undefined;
  }
}
