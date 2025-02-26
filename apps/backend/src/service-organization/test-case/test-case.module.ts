import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../../service-auth/auth/auth.module";
import { TestCaseController } from "./test-case.controller";
import { TestCaseService } from "./test-case.service";

import { ProjectModule } from "../project/project.module";

import { TestSuitesModule } from "../test-suite/test-suite.module";
import { SectionService } from "./section/section.service";
import { SectionEntity } from "./section/section.entity";
import { TestCaseEntity } from "./test-case.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => TestSuitesModule),
    TypeOrmModule.forFeature([TestCaseEntity, SectionEntity]),
  ],
  controllers: [TestCaseController],
  exports: [TestCaseService, SectionService],
  providers: [TestCaseService, SectionService],
})
export class TestCaseModule {}
