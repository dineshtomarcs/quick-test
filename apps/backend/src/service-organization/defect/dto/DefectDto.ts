import { ApiProperty } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { DefectEntity } from "../defect.entity";
import { TestCaseDto } from "../../test-case/dto/TestCaseDto";
import { TestCaseResultDto } from "../../test-suite/test-case-result/dto/TestCaseResultDto";

export class DefectDto extends AbstractDto {
  @ApiProperty()
  pluginKey: string;

  @ApiProperty()
  pluginId: string;

  testcases: TestCaseDto[];

  testCaseResults: TestCaseResultDto[];

  constructor(defect: DefectEntity) {
    super(defect);
    this.pluginId = defect.pluginId;
    this.pluginKey = defect.pluginKey;
    this.testcases = defect.testcases?.length
      ? defect.testcases.toDtos()
      : null;
    this.testCaseResults = defect.testCaseResults?.length
      ? defect.testCaseResults.toDtos()
      : null;
  }
}
