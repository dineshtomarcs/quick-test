import {
  Controller,
  UseGuards,
  UseFilters,
  HttpStatus,
  HttpCode,
  Body,
  Param,
  Patch,
  Post,
  Get,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";

import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { DefectService } from "./defect.service";
import { SubscriptionAuthStatus } from "../../decorators/subscription-status.decorator";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { UserEntity } from "../../service-users/user/user.entity";
import { UpdateDefectRefDto } from "./dto/UpdateDefectRefDto";
import { AddDefectDto } from "./dto/AddDefectDto";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permission } from "../../common/constants/permissions";
import { Permissions } from "../../decorators/permission.decorator";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../guards/org.subscription.guard";

@Controller("defects")
@ApiTags("defects")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class DefectController {
  constructor(private defectService: DefectService) {}

  /**
   * Update defects reference in testcase
   */
  @Patch("/ref/testcase/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @Permissions(Permission.UPDATE_DEFECT_REF)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update defects reference in testcase",
    type: UpdateDefectRefDto,
  })
  async updateDefectRefInTestCase(
    @Param("id", UUIDCheckPipe) id: string,
    @Body() UpdateDefectRefDto: UpdateDefectRefDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.defectService.updateDefectRefInTestCase(
      id,
      UpdateDefectRefDto,
      user,
    );
    return new ResponseSuccess("translations.UPDATE_DEFECT_REF_SUCC", response);
  }

  /**
   * Push new defect to plugin
   */
  @Post()
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.ADD_DEFECT_REF)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Push new defect to plugin",
  })
  async addDefect(
    @Body() addDefectDto: AddDefectDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.defectService.addDefect(addDefectDto, user);
    return new ResponseSuccess("translations.ADD_DEFECT", response);
  }

  /**
   * Get defect details
   */
  @Get("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_DEFECT_DETAILS)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get defect details",
  })
  async getDefectDetails(
    @Param("id") id: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.defectService.getDefectDetails(id, user);
    return new ResponseSuccess("translations.DEFECT_DETAILS", response);
  }
}
