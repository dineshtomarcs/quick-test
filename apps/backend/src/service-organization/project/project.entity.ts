import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
} from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { ProjectDto } from "./dto/ProjectDto";
import { OrganizationEntity } from "../organization/organization.entity";
import { TestCaseEntity } from "../test-case/test-case.entity";
import { TestSuiteEntity } from "../test-suite/test-suite.entity";
import { SectionEntity } from "../test-case/section/section.entity";
import { MilestoneEntity } from "../milestone/milestone.entity";
import { ActivityEntity } from "./activity/activity.entity";
import { UserEntity } from "../../service-users/user/user.entity";
import { Relation } from "typeorm";

@Entity({ name: "projects" })
export class ProjectEntity extends AbstractEntity<ProjectDto> {
  @Column({ nullable: true })
  name: string;

  @Column({ default: null })
  description: string;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.projects)
  organization: Relation<OrganizationEntity>;

  @OneToMany(() => TestSuiteEntity, (testsuite) => testsuite.project, {
    cascade: true,
  })
  testsuites: TestSuiteEntity[];

  @OneToMany(() => TestCaseEntity, (testcase) => testcase.project, {
    cascade: true,
  })
  testcases: TestCaseEntity[];

  @OneToMany(() => SectionEntity, (section) => section.project, {
    cascade: true,
  })
  sections: SectionEntity[];

  @OneToMany(() => MilestoneEntity, (milestone) => milestone.project, {
    cascade: true,
  })
  milestones: MilestoneEntity[];

  @OneToMany(() => ActivityEntity, (activity) => activity.project, {
    cascade: true,
  })
  activities: ActivityEntity[];

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.archivedProjects)
  archivedBy: Relation<UserEntity>;

  dtoClass = ProjectDto;
}
