import { ApiPropertyOptional } from "@nestjs/swagger";
import { UserEntity } from "../../../service-users/user/user.entity";
import { AbstractDto } from "../../../common/dto/AbstractDto";
import { ProjectEntity } from "../project.entity";
import { Relation } from "typeorm";

export class ProjectDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  testcases: number;

  @ApiPropertyOptional({ default: null })
  deletedAt: Date;

  @ApiPropertyOptional({ type: () => UserEntity, default: null })
  archivedBy: Relation<UserEntity>;

  constructor(project: ProjectEntity) {
    super(project);
    this.name = project.name;
    this.description = project.description;
    this.deletedAt = project.deletedAt;
    this.testcases = project.testcases ? project.testcases.length : undefined;
    this.archivedBy = project.archivedBy ? project.archivedBy : null;
  }
}
