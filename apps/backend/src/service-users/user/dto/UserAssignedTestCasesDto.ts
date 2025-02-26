import { ApiProperty } from "@nestjs/swagger";

import { UserDto } from "./UserDto";

export class UserAssignedTestCasesDto extends UserDto {
  @ApiProperty({
    type: Number,
  })
  totalActiveTestCases: number;

  @ApiProperty({
    type: Number,
  })
  totalCompletedTestCases: number;
}
