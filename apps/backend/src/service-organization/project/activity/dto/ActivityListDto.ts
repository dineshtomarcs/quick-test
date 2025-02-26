import { ApiProperty } from "@nestjs/swagger";

import { ActivityDetailDto } from "./ActivityDetailDto";

export class ActivityListDto {
  @ApiProperty({
    type: ActivityDetailDto,
    isArray: true,
  })
  readonly data: ActivityDetailDto[];

  constructor(data: ActivityDetailDto[]) {
    this.data = data;
  }
}
