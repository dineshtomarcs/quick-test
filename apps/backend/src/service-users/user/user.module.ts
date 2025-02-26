import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { AuthModule } from "../../service-auth/auth/auth.module";
import { UserController } from "./user.controller";
import { UserReadService } from "./services/read.service";
import { UserUpdateService } from "./services/update.service";
import { UserDeleteService } from "./services/delete.service";
import { UserCreateService } from "./services/create.service";

import { OrganizationModule } from "../../service-organization/organization/organization.module";

import { ProjectModule } from "../../service-organization/project/project.module";

import { PaymentModule } from "../../service-organization/payment/payment.module";

import { RoleModule } from "../../service-role/role.module";
import { UserSubscriber } from "./user.subscriber";
import { UserEntity } from "./user.entity";
import { ForgottenPasswordEntity } from "./forgotten-password-reqs.entity";
import { EmailVerifyTokenEntity } from "./email-verify-token.entity";
import { ProjecMemberEntity } from "../../service-organization/project/members/projectMember.entity";
import { TestCaseModule } from "./../../service-organization/test-case/test-case.module";
import { TestSuitesModule } from "./../../service-organization/test-suite/test-suite.module";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => OrganizationModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => RoleModule),
    forwardRef(() => TestCaseModule),
    forwardRef(() => TestSuitesModule),
    TypeOrmModule.forFeature([
      UserEntity,
      ForgottenPasswordEntity,
      EmailVerifyTokenEntity,
      ProjecMemberEntity,
    ]),
  ],
  controllers: [UserController],
  exports: [
    UserReadService,
    UserCreateService,
    UserDeleteService,
    UserUpdateService,
  ],
  providers: [
    UserReadService,
    UserCreateService,
    UserDeleteService,
    UserUpdateService,
    UserSubscriber,
  ],
})
export class UserModule {}
