import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../../service-auth/auth/auth.module";
import { ProjectReadService } from "./services/read.service";
import { ProjectCreateService } from "./services/create.service";
import { ProjectDeleteService } from "./services/delete.service";
import { ProjectUpdateService } from "./services/update.service";
import { ActivityService } from "./activity/activity.service";
import { TestCaseModule } from "../test-case/test-case.module";
import { TestSuitesModule } from "../test-suite/test-suite.module";
import { MilestoneModule } from "../milestone/milestone.module";
import { UserModule } from "../../service-users/user/user.module";
import { TestcaseRelatedProjectController } from "./controllers/project-testcase.controller";
import { ActivityRelatedProjectController } from "./controllers/project-activity.controller";
import { MilestoneRelatedProjectController } from "./controllers/project-milestone.controller";
import { SectionRelatedProjectController } from "./controllers/project-section.controller";
import { TestsuiteRelatedProjectController } from "./controllers/project-testsuite.controller";
import { ProjectController } from "./controllers/project.controller";
import { ProjectEntity } from "./project.entity";
import { ActivityEntity } from "./activity/activity.entity";
import { ProjecMemberEntity } from "./members/projectMember.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UserModule),
    forwardRef(() => TestCaseModule),
    forwardRef(() => TestSuitesModule),
    forwardRef(() => MilestoneModule),
    TypeOrmModule.forFeature([
      ProjectEntity,
      ActivityEntity,
      ProjecMemberEntity,
    ]),
  ],
  controllers: [
    ProjectController,
    TestcaseRelatedProjectController,
    ActivityRelatedProjectController,
    TestsuiteRelatedProjectController,
    SectionRelatedProjectController,
    MilestoneRelatedProjectController,
  ],
  exports: [
    ProjectCreateService,
    ProjectDeleteService,
    ProjectReadService,
    ProjectUpdateService,
    ActivityService,
  ],
  providers: [
    ProjectCreateService,
    ProjectDeleteService,
    ProjectReadService,
    ProjectUpdateService,
    ActivityService,
  ],
})
export class ProjectModule {}
