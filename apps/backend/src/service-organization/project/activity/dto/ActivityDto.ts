import { ApiPropertyOptional, ApiProperty } from "@nestjs/swagger";
import { AbstractDto } from "../../../../common/dto/AbstractDto";
import { ActivityEntityType } from "../../../../common/enums/activity-entity";
import { ActivityEntity } from "../activity.entity";
import { MilestoneEntity } from "../../../milestone/milestone.entity";
import { TestSuiteEntity } from "../../../test-suite/test-suite.entity";
import { UserEntity } from "../../../../service-users/user/user.entity";
import { ProjectEntity } from "../../project.entity";
import { TestCaseResultEntity } from "../../../test-suite/test-case-result/test-case-result.entity";

export class ActivityDto extends AbstractDto {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  entity: () => ActivityEntityType;

  @ApiProperty({
    type: String,
  })
  status: string;

  @ApiPropertyOptional({
    type: String,
  })
  action: string;

  user: UserEntity;

  testSuite: TestSuiteEntity;

  project: ProjectEntity;

  milestone: MilestoneEntity;

  testCaseResult: TestCaseResultEntity;

  constructor(activity: ActivityEntity) {
    super(activity);
    this.name = activity.name;
    this.entity = activity.entity;
    this.status = activity.status;
    this.action = activity.action;
    this.milestone = activity.milestone ? activity.milestone : null;
    this.user = activity.user ? activity.user : null;
    this.testSuite = activity.testSuite ? activity.testSuite : null;
    this.project = activity.project ? activity.project : null;
    this.testCaseResult = activity.testCaseResult
      ? activity.testCaseResult
      : null;
  }
}
