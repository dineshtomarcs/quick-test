import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "../../../../common/dto/PageMetaDto";
import { ActivityListDto } from "./ActivityListDto";

export class ActivityListPageDto {
  @ApiProperty({
    type: ActivityListDto,
    isArray: true,
  })
  readonly data: ActivityListDto;

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: ActivityListDto, meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
