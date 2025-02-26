import { Column, CreateDateColumn, Entity, OneToMany } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { OrganizationDto } from "./dto/OrganizationDto";
import { ProjectEntity } from "../project/project.entity";
import { UserEntity as Member } from "../../service-users/user/user.entity";
import { PluginConfigEntity } from "../plugin/pluginConfig.entity";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";

@Entity({ name: "organizations" })
export class OrganizationEntity extends AbstractEntity<OrganizationDto> {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  customerId: string;

  @CreateDateColumn({
    type: "timestamp without time zone",
    name: "freeTrial_start_date",
  })
  freeTrialStartDate: Date;

  @OneToMany(() => ProjectEntity, (project) => project.organization)
  projects: ProjectEntity[];

  @OneToMany(() => Member, (member) => member.organization)
  members: Member[];

  @Column({
    type: "enum",
    enum: OrgSubscriptionStatus,
    default: OrgSubscriptionStatus.freeTrial,
  })
  subscriptionStatus: OrgSubscriptionStatus;

  @OneToMany(
    () => PluginConfigEntity,
    (pluginConfig) => pluginConfig.organization,
  )
  pluginConfigs: PluginConfigEntity[];

  dtoClass = OrganizationDto;
}
