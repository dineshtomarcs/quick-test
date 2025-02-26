import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../../service-auth/auth/auth.module";
import { OrganizationController } from "./organization.controller";
import { OrganizationService } from "./organization.service";
import { ProjectModule } from "../project/project.module";
import { UserModule } from "../../service-users/user/user.module";
import { OrganizationEntity } from "./organization.entity";
import { ProjecMemberEntity } from "../project/members/projectMember.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([OrganizationEntity, ProjecMemberEntity]),
  ],
  controllers: [OrganizationController],
  exports: [OrganizationService],
  providers: [OrganizationService],
})
export class OrganizationModule {}
