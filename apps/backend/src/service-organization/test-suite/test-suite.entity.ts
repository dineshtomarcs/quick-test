import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";

import { UserEntity } from "../../service-users/user/user.entity";
import { AbstractEntity } from "../../common/abstract.entity";

import { ProjectEntity } from "../project/project.entity";

import { TestSuiteDto } from "./dto/TestSuiteDto";

import { TestCaseResultEntity } from "./test-case-result/test-case-result.entity";

import { TestSuiteReportEntity } from "./test-report/test-suite-report.entity";
import { TestSuiteStatus } from "../../common/enums/test-suite-status";

import { MilestoneEntity } from "../milestone/milestone.entity";

import { ActivityEntity } from "../project/activity/activity.entity";
import { Relation } from "typeorm";

@Entity({ name: "testsuites" })
export class TestSuiteEntity extends AbstractEntity<TestSuiteDto> {
  @Column({ nullable: true })
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  project_id: string;

  @Column({ default: null })
  userId: string;

  @Column({ default: null })
  assigned_to: string;

  @Column({ default: null })
  milestone_id: string;

  @ManyToOne(() => ProjectEntity, (project) => project.testsuites, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project: Relation<ProjectEntity>;

  @ManyToOne(() => MilestoneEntity, (milestone) => milestone.testsuites)
  @JoinColumn({ name: "milestone_id" })
  milestoneId: Relation<MilestoneEntity>;

  @ManyToOne(() => UserEntity, (user) => user.testsuites, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "user_id" })
  user: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (assignedTo) => assignedTo.assignedTestsuites, {
    onDelete: "SET NULL",
  })
  @JoinColumn({
    name: "assigned_to",
  })
  assignedTo: Relation<UserEntity>;

  @OneToOne(() => TestSuiteReportEntity, (testreport) => testreport.testsuite)
  testreport: Relation<TestSuiteReportEntity>;

  @OneToMany(() => ActivityEntity, (activity) => activity.testSuite)
  activities: ActivityEntity[];

  @OneToMany(
    () => TestCaseResultEntity,
    (testresults) => testresults.testsuite,
    { cascade: true },
  )
  testresults: TestCaseResultEntity[];

  @Column({
    type: "enum",
    enum: TestSuiteStatus,
    default: TestSuiteStatus.PENDING,
  })
  status: TestSuiteStatus;

  @Column({ default: null })
  completedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  dtoClass = TestSuiteDto;
}
