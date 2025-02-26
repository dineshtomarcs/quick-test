import { IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { MilestoneStatus } from "../../../common/enums/milestone-status";

export class UpdateMilesoneStatusDto {
  @ApiProperty()
  @IsNotEmpty({ message: "Status empty or invalid" })
  status: () => MilestoneStatus;
}
