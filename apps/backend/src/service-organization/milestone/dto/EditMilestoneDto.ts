import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, MaxLength, IsString } from "class-validator";
import { MilestoneStatus } from "../../../common/enums/milestone-status";

export class EditMilestoneDto {
  @MaxLength(200, { message: "Name max size can be 200" })
  @IsString({ message: "Name should be a string" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  name: string;

  @MaxLength(500, { message: "Description max size can be 500" })
  @IsString({ message: "Description should be a string" })
  @IsOptional()
  @ApiPropertyOptional({ type: String })
  readonly description: string;

  @IsOptional()
  readonly status: () => MilestoneStatus;

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  readonly startDate: Date;

  @IsOptional()
  @ApiPropertyOptional({ type: Date })
  readonly endDate: Date;
}
