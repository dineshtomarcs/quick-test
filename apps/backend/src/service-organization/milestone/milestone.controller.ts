import {
  Controller,
  Get,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
  UseFilters,
  Param,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { UserEntity } from "../../service-users/user/user.entity";
import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { AuthGuard } from "../../guards/auth.guard";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { MilestoneService } from "./milestone.service";
import { MilestoneDto } from "./dto/MilestoneDto";
import { UpdateMilesoneStatusDto } from "./dto/UpdateMilestoneStatusDto";
import { EditMilestoneDto } from "./dto/EditMilestoneDto";
import { SubscriptionAuthStatus } from "../../decorators/subscription-status.decorator";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permissions } from "../../decorators/permission.decorator";
import { Permission } from "../../common/constants/permissions";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../guards/org.subscription.guard";

@Controller("milestones")
@ApiTags("milestones")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class MilestoneController {
  constructor(private readonly _milestoneService: MilestoneService) {}

  /**
   * Delete a Milestone
   */

  @Delete("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.DELETE_MILESTONE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete Milestone",
    type: MilestoneDto,
  })
  async deleteMilestone(
    @Param("id") milestoneId: string,
  ): Promise<ResponseSuccess> {
    await this._milestoneService.deleteMilestone(milestoneId);
    return new ResponseSuccess("translations.MILESTONE_DELETED", {});
  }

  /*
   *  Update milestone status
   */
  @Put("/:id/status")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.UPDATE_MILESTONE_STATUS)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update milestone status",
    type: UpdateMilesoneStatusDto,
  })
  async updateMilestoneStatus(
    @Body() updateMilesoneStatusDto: UpdateMilesoneStatusDto,
    @Param("id", UUIDCheckPipe) milestoneId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const newMilestone = await this._milestoneService.updateMilestoneStatus(
      updateMilesoneStatusDto,
      milestoneId,
      user,
    );
    return new ResponseSuccess(
      "translations.MILESTONE_STATUS_UPDATED",
      newMilestone.toDto(),
    );
  }

  /*
   *  Update milestone
   */
  @Put("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.UPDATE_MILESTONE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update milestone",
    type: EditMilestoneDto,
  })
  async editMilestone(
    @Body() editMilesoneDto: EditMilestoneDto,
    @Param("id", UUIDCheckPipe) milestoneId: string,
  ): Promise<ResponseSuccess> {
    const updatedMilestone = await this._milestoneService.editMilestone(
      editMilesoneDto,
      milestoneId,
    );
    return new ResponseSuccess(
      "translations.MILESTONE_UPDATE",
      updatedMilestone.toDto(),
    );
  }

  /*
   *  Get milestone detail of a project
   */
  @Get("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_MILESTONE_DETAILS)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get all milestones of a project",
    type: MilestoneDto,
  })
  async getAllMilestones(
    @Param("id", UUIDCheckPipe) milestoneId: string,
  ): Promise<ResponseSuccess> {
    const milestones =
      await this._milestoneService.milestoneDetail(milestoneId);
    return new ResponseSuccess("translations.MILESTONE_DETAILS", milestones);
  }
}
