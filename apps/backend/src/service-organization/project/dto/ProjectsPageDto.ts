import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "../../../common/dto/PageMetaDto";
import { ProjectDto } from "./ProjectDto";

export class ProjectsPageDto {
  @ApiProperty({
    type: ProjectDto,
    isArray: true,
  })
  readonly data: ProjectDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: ProjectDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
