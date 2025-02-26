import { ApiProperty } from "@nestjs/swagger";

import { MostActiveProjectDto } from "./MostActiveProjectDto";

export class MostActiveProjectListDto {
  @ApiProperty({
    type: MostActiveProjectDto,
    isArray: true,
  })
  readonly projects: MostActiveProjectDto[];

  @ApiProperty()
  readonly date: Date;

  constructor(date: Date, projects: MostActiveProjectDto[]) {
    this.date = date;
    this.projects = projects;
  }
}
