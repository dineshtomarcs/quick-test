import { ApiProperty } from "@nestjs/swagger";

import { ActivityDto } from "./ActivityDto";

export class ActivityDetailDto {
  @ApiProperty({
    type: String,
  })
  readonly date: string;

  @ApiProperty({
    type: ActivityDto,
    isArray: true,
  })
  readonly activities: ActivityDto[];

  constructor(date: string, activities: ActivityDto[]) {
    this.date = date;
    this.activities = activities;
  }
}
