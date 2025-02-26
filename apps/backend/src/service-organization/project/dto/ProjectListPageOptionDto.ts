import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { Min, IsInt, IsOptional } from "class-validator";

import { PageOptionsDto } from "../../../common/dto/PageOptionsDto";

export class ProjectListPageOptionsDto extends PageOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 7,
  })
  @Min(1, { message: "Days should be greater than 0" })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  readonly days: number = 7;
}
