import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  DeleteDateColumn,
} from "typeorm";

import { TestSuiteEntity } from "../../service-organization/test-suite/test-suite.entity";
import { AbstractEntity } from "../../common/abstract.entity";
import { UserDto } from "./dto/UserDto";
import { OrganizationEntity } from "../../service-organization/organization/organization.entity";
import { ActivityEntity } from "../../service-organization/project/activity/activity.entity";
import { ProjectEntity } from "../../service-organization/project/project.entity";
import { TestCaseEntity } from "../../service-organization/test-case/test-case.entity";
import { RoleEntity } from "../../service-role/role.entity";
import { Exclude } from "class-transformer";

@Entity({ name: "users" })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column({ nullable: true })
  firstName: string;

  @Column({ default: null })
  lastName: string;

  @Column({ nullable: true })
  roleId: number;

  @ManyToOne(() => RoleEntity, (role) => role.id, {
    nullable: true,
  })
  @JoinColumn({ name: "role_id" })
  role: RoleEntity;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true, default: "Member" })
  title: string;

  @Column({ default: false })
  isSubscribed: boolean;

  @Column({ default: false })
  isVerified: boolean;

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true, name: "postal_code" })
  postalCode: string;

  @Column({ default: null })
  phone: string;

  @Column({ default: null })
  organization_id: string;

  @Column({ default: "en" })
  language: string;

  @OneToMany(() => TestSuiteEntity, (testsuites) => testsuites.user, {
    cascade: true,
  })
  testsuites: TestSuiteEntity[];

  @OneToMany(() => TestCaseEntity, (testcases) => testcases.createdBy)
  testcasescreatedBy: TestCaseEntity[];

  @OneToMany(() => TestCaseEntity, (testcases) => testcases.updatedBy)
  testcasesupdatedBy: TestCaseEntity[];

  @OneToMany(
    () => TestSuiteEntity,
    (assignedTestsuites) => assignedTestsuites.assignedTo,
    { cascade: true },
  )
  assignedTestsuites: TestSuiteEntity[];

  @OneToMany(() => ActivityEntity, (activity) => activity.user, {
    cascade: true,
  })
  activities: ActivityEntity[];

  @ManyToOne(() => OrganizationEntity, { eager: true })
  @JoinColumn({ name: "organization_id" })
  organization: OrganizationEntity;

  @Column({ default: null })
  profileImage: string;

  @ManyToMany(() => ProjectEntity, { cascade: true })
  @JoinTable({ name: "user_favorite_projects" })
  favoriteProjects: ProjectEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.archivedBy)
  archivedProjects: ProjectEntity[];

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "uuid", nullable: true })
  archived_by: string;

  @ManyToOne(() => UserEntity, (user) => user.archivedByUser)
  @JoinColumn({ name: "archived_by" })
  archivedByUser: UserEntity;

  dtoClass = UserDto;
}
