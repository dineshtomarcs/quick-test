import { ApiProperty } from "@nestjs/swagger";

export class CreateTestSuiteReportDto {
  @ApiProperty({ type: Number })
  passed: number;

  @ApiProperty({ type: Number })
  failed: number;

  @ApiProperty({ type: Number })
  blocked: number;

  @ApiProperty({ type: Number })
  retest: number;

  @ApiProperty({ type: Number })
  untested: number;

  @ApiProperty({ type: Number })
  total: number;
}
