import {
  Column,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  DeleteDateColumn,
} from "typeorm";
import { AbstractEntity } from "../../../common/abstract.entity";
import { TestCaseResultDto } from "./dto/TestCaseResultDto";
import { TestSuiteEntity } from "../test-suite.entity";
import { TestCaseResultStatus } from "../../../common/enums/test-case-result-status";
import { ActivityEntity } from "../../project/activity/activity.entity";
import { DefectEntity } from "../../defect/defect.entity";
import { Relation } from "typeorm";

@Entity({ name: "test_case_results" })
export class TestCaseResultEntity extends AbstractEntity<TestCaseResultDto> {
  @Column({ default: null })
  comment: string;

  @Column({ nullable: true, default: null })
  testSuiteId: string;

  @ManyToOne(() => TestSuiteEntity, (testsuite) => testsuite.testresults, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "test_suite_id",
  })
  testsuite: Relation<TestSuiteEntity>;

  @Column({
    type: "enum",
    enum: TestCaseResultStatus,
    default: TestCaseResultStatus.UNTESTED,
  })
  status: TestCaseResultStatus;

  @Column({ default: null })
  testCaseTitle: string;

  @Column({ default: null })
  testCaseExecutionPriority: string;

  @Column({ default: null })
  testCasePreconditions: string;

  @Column({ default: null })
  testCaseSteps: string;

  @Column({ default: null })
  testCaseExpectedResults: string;

  @Column({ nullable: true, default: null })
  sectionName: string;

  @Column({ default: null })
  sectionDescription: string;

  @Column({ default: null })
  testCaseId: number;

  @OneToMany(() => ActivityEntity, (activity) => activity.testCaseResult)
  activities: ActivityEntity[];

  @ManyToOne(() => DefectEntity, (defect) => defect.testCaseResults)
  defect: Relation<DefectEntity>;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: null })
  image: string;

  dtoClass = TestCaseResultDto;
}
