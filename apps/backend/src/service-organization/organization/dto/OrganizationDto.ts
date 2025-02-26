import { ApiProperty } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { OrganizationEntity } from "../organization.entity";
import { ProjectDto } from "../../project/dto/ProjectDto";

export class OrganizationDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  projects: ProjectDto[];

  @ApiProperty()
  subscriptionStatus: any;

  constructor(organization: OrganizationEntity) {
    super(organization);
    this.name = organization.name;
    this.subscriptionStatus = organization.subscriptionStatus;
    this.projects = organization.projects
      ? organization.projects.toDtos()
      : null;
  }
}
