import { Entity, Column, OneToMany, ManyToOne } from "typeorm";

import { AbstractEntity } from "../../common/abstract.entity";
import { Plugins } from "../../common/enums/plugins";
import { OrganizationEntity } from "../organization/organization.entity";
import { DefectEntity } from "../defect/defect.entity";
import { PluginConfigDto } from "./dto/PluginConfigDto";
import { Relation } from "typeorm";

@Entity({ name: "plugin_config" })
export class PluginConfigEntity extends AbstractEntity<PluginConfigDto> {
  @Column({ default: false })
  isIntegrated: boolean;

  // @Column({ type: "enum", enum: Plugins, nullable:false })
  // plugin: Plugins

  @Column({ default: Plugins.JIRA, nullable: false })
  plugin: string;

  @Column({ default: null })
  userName: string;

  @Column({ default: null })
  accessToken: string;

  @Column({ default: null })
  webAddress: string;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.pluginConfigs,
  )
  organization: Relation<OrganizationEntity>;

  @OneToMany(() => DefectEntity, (defects) => defects.pluginConfig)
  defects: DefectEntity[];

  dtoClass = PluginConfigDto;
}
