import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "../../../common/dto/PageMetaDto";
import { OrganizationDto } from "./OrganizationDto";

export class OrganizationsPageDto {
  @ApiProperty({
    type: OrganizationDto,
    isArray: true,
  })
  readonly data: OrganizationDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: OrganizationDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
