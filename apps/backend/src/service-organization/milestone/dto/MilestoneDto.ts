import { ApiPropertyOptional } from "@nestjs/swagger";
import { MilestoneStatus } from "../../../common/enums/milestone-status";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { MilestoneEntity } from "../milestone.entity";

export class MilestoneDto extends AbstractDto {
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  description: string;

  @ApiPropertyOptional()
  status: () => MilestoneStatus;

  @ApiPropertyOptional()
  startDate: Date;

  @ApiPropertyOptional()
  endDate: Date;

  constructor(milestone: MilestoneEntity) {
    super(milestone);
    this.name = milestone.name;
    this.description = milestone.description;
    this.status = milestone.status;
    this.startDate = milestone.startDate;
    this.endDate = milestone.endDate;
  }
}
