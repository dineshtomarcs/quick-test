import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsUUID,
} from "class-validator";

import { TestSuiteStatus } from "../../../common/enums/test-suite-status";

export class EditTestSuiteDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsNotEmpty({ message: "Name cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsNotEmpty({ message: "Description cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  description: string;

  @IsEnum(() => TestSuiteStatus, {
    message: "Test Suite can be INPROGRESS or COMPLETED or PENDING only",
  })
  @IsNotEmpty({ message: "Status cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  status: () => TestSuiteStatus;

  @IsUUID(4, { message: "Assigned to should be an uuid" })
  @IsNotEmpty({ message: "Assigned to cannot be empty" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  assignTo: string;

  @IsUUID(4, { message: "Milestone to should be an uuid" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  milestone: string;
}
