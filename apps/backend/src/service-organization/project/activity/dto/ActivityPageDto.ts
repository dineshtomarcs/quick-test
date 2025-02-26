import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "../../../../common/dto/PageMetaDto";
import { ActivityDto } from "./ActivityDto";

export class ActivityPageDto {
  @ApiProperty({
    type: ActivityDto,
    isArray: true,
  })
  readonly data: ActivityDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: ActivityDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
