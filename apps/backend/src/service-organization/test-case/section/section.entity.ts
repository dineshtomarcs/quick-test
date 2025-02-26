import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  JoinColumn,
} from "typeorm";
import { AbstractEntity } from "../../../common/abstract.entity";
import { ProjectEntity } from "../../project/project.entity";
import { TestCaseEntity } from "../test-case.entity";
import { SectionDto } from "./dto/SectionDto";
import { Relation } from "typeorm";

@Entity({ name: "sections" })
export class SectionEntity extends AbstractEntity<SectionDto> {
  @Column({ nullable: true, default: "Unassigned" })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  projectId: string;

  @ManyToOne(() => ProjectEntity, (project) => project.sections, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "project_id" })
  project: Relation<ProjectEntity>;

  @OneToMany(() => TestCaseEntity, (testcases) => testcases.section, {
    cascade: true,
  })
  testcases: TestCaseEntity[];

  @DeleteDateColumn()
  deletedAt: Date;

  dtoClass = SectionDto;
}
