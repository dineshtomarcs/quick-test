import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  DeleteDateColumn,
  Unique,
} from "typeorm";
import { AbstractEntity } from "../../common/abstract.entity";
import { TestCaseDto } from "./dto/TestCaseDto";
import { ProjectEntity } from "../project/project.entity";
import { SectionEntity } from "./section/section.entity";
import { ExecutionPriority } from "../../common/enums/execution-priority";
import { UserEntity } from "../../service-users/user/user.entity";
import { DefectEntity } from "../defect/defect.entity";
import { Relation } from "typeorm";

@Entity({ name: "testcases" })
@Unique("projectAndTestCaseId", ["project", "testcaseId"])
export class TestCaseEntity extends AbstractEntity<TestCaseDto> {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: null })
  preconditions: string;

  @Column({ default: null })
  steps: string;

  @Column({ default: null })
  expectedResults: string;

  @Column({ default: null })
  sectionId: string;

  @Column({ type: "uuid", nullable: false })
  created_by_id: string;

  @Column({ type: "uuid", nullable: true })
  updated_by_id: string;

  @ManyToOne(() => ProjectEntity, (project) => project.testcases, {
    onDelete: "CASCADE",
  })
  project: Relation<ProjectEntity>;

  @ManyToOne(() => UserEntity, (user) => user.testcasescreatedBy)
  @JoinColumn({ name: "created_by_id" })
  createdBy: Relation<UserEntity>;

  @ManyToOne(() => UserEntity, (user) => user.testcasesupdatedBy)
  @JoinColumn({ name: "updated_by_id" })
  updatedBy: Relation<UserEntity>;

  @ManyToOne(() => DefectEntity, (defects) => defects.testcases)
  defect: Relation<DefectEntity>;

  @ManyToOne(() => SectionEntity, (section) => section.testcases)
  @JoinColumn({ name: "section_id" })
  section: Relation<SectionEntity>;

  @Column({ type: "int", default: 1 })
  testcaseId: number;

  @Column({ type: "uuid" })
  project_id: string;

  @Column({ type: "int", default: 0 })
  priority: number;

  @Column({
    type: "enum",
    enum: ExecutionPriority,
    default: ExecutionPriority.MEDIUM,
    nullable: false,
  })
  executionPriority: ExecutionPriority;

  @DeleteDateColumn()
  deletedAt: Date;

  dtoClass = TestCaseDto;
}
