import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../../service-auth/auth/auth.module";
import { TestSuitesController } from "./test-suite.controller";
import { TestCaseResultService } from "./test-case-result/test-case-result.service";

import { TestCaseModule } from "../test-case/test-case.module";
import { TestSuiteService } from "./test-suite.service";

import { ProjectModule } from "../project/project.module";

import { UserModule } from "../../service-users/user/user.module";

import { DefectModule } from "../defect/defect.module";
import { TestSuiteEntity } from "./test-suite.entity";
import { TestCaseEntity } from "../test-case/test-case.entity";
import { TestSuiteReportEntity } from "./test-report/test-suite-report.entity";
import { TestCaseResultEntity } from "./test-case-result/test-case-result.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => TestCaseModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => UserModule),
    forwardRef(() => DefectModule),
    TypeOrmModule.forFeature([
      TestCaseResultEntity,
      TestSuiteEntity,
      TestCaseEntity,
      TestSuiteReportEntity,
    ]),
  ],
  controllers: [TestSuitesController],
  exports: [TestCaseResultService, TestSuiteService],
  providers: [TestCaseResultService, TestSuiteService],
})
export class TestSuitesModule {}
