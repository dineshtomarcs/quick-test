import { ApiProperty } from "@nestjs/swagger";

import { ProjectDto } from "./ProjectDto";

export class MostActiveProjectDto extends ProjectDto {
  @ApiProperty()
  totalTestChanges: number;

  constructor(project) {
    super(project);
    this.totalTestChanges = project.totalTestChanges
      ? project.totalTestChanges
      : 0;
  }
}
