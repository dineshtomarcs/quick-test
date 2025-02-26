import { ApiProperty } from "@nestjs/swagger";
import { TestSuiteStatus } from "../../../common/enums/test-suite-status";
import { AbstractDto } from "../../../common/dto/AbstractDto";

import { TestSuiteEntity } from "../test-suite.entity";
import { TestSuiteReportDto } from "../test-report/dto/TestSuiteReportDto";

import { UserEntity } from "../../../service-users/user/user.entity";

export class TestSuiteListDto extends AbstractDto {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  status: TestSuiteStatus;

  assignedTo: UserEntity;

  user: UserEntity;

  @ApiProperty()
  testreport: TestSuiteReportDto;

  constructor(testSuite: TestSuiteEntity) {
    super(testSuite);
    this.name = testSuite.name;
    this.description = testSuite.description;
    this.status = testSuite.status;
    this.testreport = testSuite.testreport
      ? testSuite.testreport.toDto()
      : null;
    this.assignedTo = testSuite.assignedTo ? testSuite.assignedTo : null;
    this.user = testSuite.user ? testSuite.user : null;
  }
}
