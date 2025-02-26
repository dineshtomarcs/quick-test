import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { PluginService } from "./plugin.service";
import { PluginsController } from "./plugin.controller";
import { OrganizationModule } from "../organization/organization.module";
import { PluginConfigEntity } from "./pluginConfig.entity";

@Module({
  imports: [
    forwardRef(() => OrganizationModule),
    TypeOrmModule.forFeature([PluginConfigEntity]),
  ],
  controllers: [PluginsController],
  exports: [PluginService],
  providers: [PluginService],
})
export class PluginModule {}
