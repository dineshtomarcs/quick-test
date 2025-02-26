import { ApiProperty } from "@nestjs/swagger";

import { TestSuiteListDto } from "./TestSuiteListDto";
import { UserAssignedTestCasesDto } from "../../../service-users/user/dto/UserAssignedTestCasesDto";

export class TestSuiteTodoListDto {
  @ApiProperty({
    type: UserAssignedTestCasesDto,
    isArray: true,
  })
  readonly users: UserAssignedTestCasesDto[];

  @ApiProperty({
    type: TestSuiteListDto,
    isArray: true,
  })
  readonly testSuiteList: TestSuiteListDto[];

  constructor(
    users: UserAssignedTestCasesDto[],
    testSuiteList: TestSuiteListDto[],
  ) {
    this.users = users;
    this.testSuiteList = testSuiteList;
  }
}
