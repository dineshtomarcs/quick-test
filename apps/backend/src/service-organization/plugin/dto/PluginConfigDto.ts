import { ApiProperty } from "@nestjs/swagger";

import { AbstractDto } from "../../../common/dto/AbstractDto";
import { PluginConfigEntity } from "../pluginConfig.entity";
import { Plugins } from "../../../common/enums/plugins";
import { OrganizationEntity } from "../../organization/organization.entity";

export class PluginConfigDto extends AbstractDto {
  @ApiProperty()
  isIntegrated: boolean;

  @ApiProperty()
  plugin: () => Plugins;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  webAddress: string;

  @ApiProperty({ type: () => OrganizationEntity })
  organization: () => OrganizationEntity;

  constructor(pluginConfig: PluginConfigEntity) {
    super(pluginConfig);
    this.isIntegrated = pluginConfig.isIntegrated;
    this.plugin = pluginConfig.plugin;
    this.userName = pluginConfig.userName;
    this.accessToken = pluginConfig.accessToken;
    this.webAddress = pluginConfig.webAddress;
    this.organization = pluginConfig.organization;
  }
}
