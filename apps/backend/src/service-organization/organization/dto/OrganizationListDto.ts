import { ApiProperty } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { OrganizationEntity } from "../organization.entity";
import { ProjectDto } from "../../project/dto/ProjectDto";
import { UserDto } from "../../../service-users/user/dto/UserDto";

export class OrganizationListDto extends AbstractDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  projects: ProjectDto[];

  @ApiProperty()
  members: UserDto[];

  constructor(organization: OrganizationEntity) {
    super(organization);
    this.name = organization.name;
    this.projects = organization.projects
      ? organization.projects.toDtos()
      : null;
    this.members = organization.members ? organization.members.toDtos() : null;
  }
}
