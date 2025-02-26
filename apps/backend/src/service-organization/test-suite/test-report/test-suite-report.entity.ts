import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { AbstractEntity } from "../../../common/abstract.entity";
import { TestSuiteReportDto } from "./dto/TestSuiteReportDto";
import { TestSuiteEntity } from "../test-suite.entity";
import { Relation } from "typeorm";

@Entity({ name: "testreports" })
export class TestSuiteReportEntity extends AbstractEntity<TestSuiteReportDto> {
  @Column({ default: 0 })
  passed: number;

  @Column({ default: 0 })
  failed: number;

  @Column({ default: 0 })
  blocked: number;

  @Column({ default: 0 })
  retest: number;

  @Column({ default: 0 })
  untested: number;

  @Column({ default: 0 })
  total: number;

  @Column({ nullable: true })
  test_suite_id: string;

  @OneToOne(() => TestSuiteEntity, (testsuite) => testsuite.testreport, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "test_suite_id" })
  testsuite: Relation<TestSuiteEntity>;

  dtoClass = TestSuiteReportDto;
}
