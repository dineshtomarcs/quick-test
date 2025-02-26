import { ApiProperty } from "@nestjs/swagger";
import { PageMetaDto } from "../../../common/dto/PageMetaDto";
import { TestSuiteListDto } from "./TestSuiteListDto";

export class TestSuitesPageDto {
  @ApiProperty({
    type: TestSuiteListDto,
    isArray: true,
  })
  readonly data: TestSuiteListDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(data: TestSuiteListDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
