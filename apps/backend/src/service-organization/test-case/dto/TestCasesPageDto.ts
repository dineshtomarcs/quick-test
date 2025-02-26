import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "../../../common/dto/PageMetaDto";
import { TestCaseDto } from "./TestCaseDto";

export class TestCasesPageDto {
  @ApiProperty({
    type: TestCaseDto,
    isArray: true,
  })
  readonly data: TestCaseDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: TestCaseDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
