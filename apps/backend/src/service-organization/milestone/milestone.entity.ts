import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectEntity } from "../project/project.entity";
import { TestSuiteEntity } from "../test-suite/test-suite.entity";
import { MilestoneDto } from "./dto/MilestoneDto";
import { MilestoneStatus } from "../../common/enums/milestone-status";
import { ActivityEntity } from "../project/activity/activity.entity";
import { Relation } from "typeorm";

@Entity({ name: "milestones" })
export class MilestoneEntity extends AbstractEntity<MilestoneDto> {
  @Column({ nullable: true })
  name: string;

  @Column({ default: null })
  description: string;

  @Column({ default: null })
  startDate: Date;

  @Column({ default: null })
  endDate: Date;

  @Column({
    type: "enum",
    enum: MilestoneStatus,
    default: MilestoneStatus.OPEN,
  })
  status: MilestoneStatus;

  @Column({ default: null })
  projectId: string;

  @ManyToOne(() => ProjectEntity, (project) => project.milestones, {
    onDelete: "CASCADE",
  })
  project: Relation<ProjectEntity>;

  @OneToMany(() => TestSuiteEntity, (testsuite) => testsuite.milestoneId, {
    cascade: true,
  })
  testsuites: TestSuiteEntity[];

  @OneToMany(() => ActivityEntity, (activity) => activity.milestone)
  activities: ActivityEntity[];

  @Column({ default: null })
  completedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  dtoClass = MilestoneDto;
}
