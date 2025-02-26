import { ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../../common/dto/AbstractDto";
import { TestSuiteReportEntity } from "../test-suite-report.entity";

export class TestSuiteReportDto extends AbstractDto {
  @ApiProperty({ type: Number })
  passed: number;

  @ApiProperty({ type: Number })
  failed: number;

  @ApiProperty({ type: Number })
  untested: number;

  @ApiProperty({ type: Number })
  blocked: number;

  @ApiProperty({ type: Number })
  total: number;

  constructor(testReport: TestSuiteReportEntity) {
    super(testReport);
    this.passed = testReport.passed;
    this.failed = testReport.failed;
    this.untested = testReport.untested;
    this.blocked = testReport.blocked;
    this.total = testReport.total;
  }
}
