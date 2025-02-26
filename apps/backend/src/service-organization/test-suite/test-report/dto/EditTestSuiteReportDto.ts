import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class EditTestSuiteReportDto {
  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  passed: number;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  failed: number;

  @IsOptional()
  @ApiPropertyOptional({ type: Number })
  untested: number;
}
