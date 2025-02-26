import { ApiProperty } from "@nestjs/swagger";

import { PageMetaDto } from "../../../../common/dto/PageMetaDto";
import { TestCaseResultDto } from "./TestCaseResultDto";

export class TestcasesResultsPageDto {
  @ApiProperty({
    type: TestCaseResultDto,
    isArray: true,
  })
  readonly data: TestCaseResultDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: TestCaseResultDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
