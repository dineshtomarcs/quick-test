import { ApiProperty } from "@nestjs/swagger";

import { AbstractDto } from "../../../../common/dto/AbstractDto";

import { SectionEntity } from "../section.entity";

import { TestCaseDto } from "../../dto/TestCaseDto";

export class SectionDto extends AbstractDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty()
  testcases: TestCaseDto[];

  constructor(section: SectionEntity) {
    super(section);
    this.name = section.name;
    this.description = section.description;
    this.testcases = section.testcases ? section.testcases.toDtos() : [];
  }
}
