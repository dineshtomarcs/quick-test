import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Body,
  UseFilters,
  Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { UserEntity } from "../../../service-users/user/user.entity";
import { AuthGuard } from "../../../guards/auth.guard";
import { ProjectCreateService } from "../services/create.service";
import { ProjectReadService } from "../services/read.service";
import { ResponseSuccess } from "../../../common/dto/SuccessResponseDto";
import { UUIDCheckPipe } from "../../../common/pipes/uuid-check.pipe";
import { ExceptionResponseFilter } from "../../../common/filters/exception-response.filter";
import { CreateMilestoneDto } from "../../milestone/dto/CreateMilestoneDto";
import { MilestoneDto } from "../../milestone/dto/MilestoneDto";
import { MilestoneDetailsDto } from "../../milestone/dto/MilestoneDetailDto";
import { SubscriptionAuthStatus } from "../../../decorators/subscription-status.decorator";
import { PermissionsGuard } from "../../../guards/permission.guard";
import { Permissions } from "../../../decorators/permission.decorator";
import { Permission } from "../../../common/constants/permissions";
import { OrgSubscriptionStatus } from "../../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../../guards/org.subscription.guard";
import { ProjectAuthGuard } from "../../../guards/projectAuth.guard";

@Controller("projects")
@ApiTags("projects")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MilestoneRelatedProjectController {
  constructor(
    private _projectReadService: ProjectReadService,
    private _projectCreateService: ProjectCreateService,
  ) {}

  /**
   * Create a new Milestone
   */
  @Post("/:id/milestone")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.CREATE_MILESTONE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Creates a new Milestone",
    type: CreateMilestoneDto,
  })
  async createMilestone(
    @Body()
    createMilestoneDto: CreateMilestoneDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const milestone = await this._projectCreateService.createMilestone(
      createMilestoneDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.MILESTONE_CREATED", milestone);
  }

  /*
   *  Get All open milestones of a project
   */
  @Get("/:id/open/milestones")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_OPEN_MILESTONES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get all open milestones of a project",
    type: MilestoneDto,
  })
  async getMilestones(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const milestones = await this._projectReadService.getOpenMilestones(
      projectId,
      user,
    );
    return new ResponseSuccess("translations.MILESTONES_LIST_OPEN", milestones);
  }

  /*
   *  Get All milestones of a project
   */
  @Get("/:id/milestones")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_ALL_MILESTONES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get all milestones of a project",
    type: MilestoneDetailsDto,
  })
  async getAllMilestones(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const milestones = await this._projectReadService.getAllMilestones(
      projectId,
      user,
    );
    return new ResponseSuccess("translations.ALL_MILESTONE_LIST", milestones);
  }
}
