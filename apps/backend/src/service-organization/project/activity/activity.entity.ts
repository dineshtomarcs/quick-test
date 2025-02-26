import { Column, DeleteDateColumn, Entity, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../../common/abstract.entity";
import { ActivityDto } from "./dto/ActivityDto";
import { ActivityEntityType } from "../../../common/enums/activity-entity";
import { MilestoneEntity } from "../../milestone/milestone.entity";
import { TestSuiteEntity } from "../../test-suite/test-suite.entity";
import { UserEntity } from "../../../service-users/user/user.entity";
import { TestCaseResultEntity } from "../../test-suite/test-case-result/test-case-result.entity";
import { ProjectEntity } from "../project.entity";
import { Relation } from "typeorm";

@Entity({ name: "activities" })
export class ActivityEntity extends AbstractEntity<ActivityDto> {
  @Column()
  name: string;

  @Column({
    type: "enum",
    enum: ActivityEntityType,
  })
  entity: ActivityEntityType;

  @Column()
  status: string;

  @Column({ nullable: true })
  action: string;

  @Column({ default: null })
  userId: string;

  @Column({ default: null })
  testSuiteId: string;

  @Column({ default: null })
  testCaseResultId: string;

  @Column({ default: null })
  milestoneId: string;

  @Column({ default: null })
  projectId: string;

  @ManyToOne(() => MilestoneEntity, (milestone) => milestone.activities)
  milestone: Relation<MilestoneEntity>;

  @ManyToOne(
    () => TestCaseResultEntity,
    (testCaseResult) => testCaseResult.activities,
  )
  testCaseResult: Relation<TestCaseResultEntity>;

  @ManyToOne(() => ProjectEntity, (project) => project.activities, {
    onDelete: "CASCADE",
  })
  project: Relation<ProjectEntity>;

  @ManyToOne(() => TestSuiteEntity, (testSuite) => testSuite.activities)
  testSuite: Relation<TestSuiteEntity>;

  @ManyToOne(() => UserEntity, (user) => user.activities, {
    onDelete: "SET NULL",
  })
  user: Relation<UserEntity>;

  @DeleteDateColumn()
  deletedAt: Date;

  dtoClass = ActivityDto;
}
