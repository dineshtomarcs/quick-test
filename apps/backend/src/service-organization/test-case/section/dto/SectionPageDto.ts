import { ApiProperty } from "@nestjs/swagger";

import { SectionDto } from "./SectionDto";
import { PageMetaDto } from "../../../../common/dto/PageMetaDto";

export class SectionPageDto {
  @ApiProperty({
    type: SectionDto,
    isArray: true,
  })
  readonly data: SectionDto[];

  @ApiProperty({
    type: PageMetaDto,
  })
  readonly meta: PageMetaDto;

  constructor(data: SectionDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
