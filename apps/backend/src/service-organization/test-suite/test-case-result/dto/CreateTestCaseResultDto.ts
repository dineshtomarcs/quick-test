import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsEnum,
  IsOptional,
} from "class-validator";

import { TestCaseResultStatus } from "../../../../common/enums/test-case-result-status";

export class CreateTestCaseResultDto {
  @IsEnum(() => TestCaseResultStatus, {
    message:
      "Test result status can be 'PASSED', 'BLOCKED', 'RETEST', 'FAILED' or 'UNTESTED' only",
  })
  @IsNotEmpty({ message: "Status can not empty" })
  @ApiProperty({ type: String })
  status: () => TestCaseResultStatus;

  @MaxLength(500, { message: "Comment max size can be 500" })
  @IsString({ message: "Comment should be a string" })
  @IsNotEmpty({ message: "Comment can not empty" })
  @ApiProperty({ type: String })
  comment: string;

  @IsString({ message: "Image should be a string" })
  @IsNotEmpty({ message: "Image cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  image: string;
}
