import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { DefectService } from "./defect.service";
import { DefectController } from "./defect.controller";
import { DefectRepository } from "./defect.repository";
import { PluginModule } from "../plugin/plugin.module";
import { TestCaseModule } from "../test-case/test-case.module";

@Module({
  imports: [
    forwardRef(() => PluginModule),
    forwardRef(() => TestCaseModule),
    TypeOrmModule.forFeature([DefectRepository]),
  ],
  controllers: [DefectController],
  exports: [DefectService],
  providers: [DefectService],
})
export class DefectModule {}
