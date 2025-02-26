import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "../../service-auth/auth/auth.module";
import { ProjectModule } from "../project/project.module";
import { MilestoneController } from "./milestone.controller";
import { MilestoneService } from "./milestone.service";
import { MilestoneEntity } from "./milestone.entity";

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => ProjectModule),
    TypeOrmModule.forFeature([MilestoneEntity]),
  ],
  controllers: [MilestoneController],
  exports: [MilestoneService],
  providers: [MilestoneService],
})
export class MilestoneModule {}
