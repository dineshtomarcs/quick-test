import {
  Controller,
  UseGuards,
  UseFilters,
  HttpStatus,
  HttpCode,
  Post,
  Body,
  Get,
  Put,
  Param,
  Query,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags, ApiResponse } from "@nestjs/swagger";

import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { PluginService } from "./plugin.service";
import { SubscriptionAuthStatus } from "../../decorators/subscription-status.decorator";
import { AuthUser } from "../../decorators/auth-user.decorator";
import { AddPluginConfigDto } from "./dto/AddPluginConfigDto";
import { UpdatePluginConfigDto } from "./dto/UpdatePluginConfigDto";
import { UserEntity } from "../../service-users/user/user.entity";
import { PluginConfigDto } from "./dto/PluginConfigDto";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permissions } from "../../decorators/permission.decorator";
import { Permission } from "../../common/constants/permissions";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../guards/org.subscription.guard";

@Controller("plugins")
@ApiTags("plugins")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class PluginsController {
  constructor(private pluginService: PluginService) {}

  /**
   * Add new plugin configurations
   */
  @Post("/config")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.ADD_PLUGIN)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Add new plugin configurations",
    type: AddPluginConfigDto,
  })
  async addPluginConfig(
    @Body() addPluginConfigDto: AddPluginConfigDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.addPluginConfig(
      addPluginConfigDto,
      user,
    );
    return new ResponseSuccess("translations.PLUGIN_CONFIG_ADDED", response);
  }

  /**
   * Get plugin configurations
   */
  @Get("/config")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_PLUGIN)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get plugin configurations ",
    type: PluginConfigDto,
  })
  async getPluginConfig(
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.getJiraPluginConfigByOrgId(
      user?.organization?.id,
    );
    return new ResponseSuccess(
      "translations.PLUGIN_CONFIG_DETAILS",
      response?.toDto(),
    );
  }

  /**
   * Update plugin configurations
   */
  @Put("/config/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.UPDATE_PLUGIN)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update plugin configurations",
    type: UpdatePluginConfigDto,
  })
  async updatePluginConfig(
    @Param("id", UUIDCheckPipe) id: string,
    @Body() updatePluginConfigDto: UpdatePluginConfigDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.updatePluginConfig(
      id,
      updatePluginConfigDto,
      user,
    );
    return new ResponseSuccess("translations.PLUGIN_CONFIG_UPDATED", response);
  }

  /**
   * Get list of projects in plugin
   */
  @Get("/projects")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_PLUGIN)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get list of projects in plugin",
  })
  async getPluginProjects(
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.getPluginProjects(user);
    return new ResponseSuccess("translations.PLUGIN_PROJECTS", response);
  }

  /**
   * Get list of issues in plugin project
   */
  @Get("/issues")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.LIST_ISSUES_PLUGIN)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get list of issues in plugin project",
  })
  async getAllIssueKeysInPluginProject(
    @Query("projectKey") projectKey: string,
    @Query("subtask") subtask: boolean,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.getAllIssueKeysInPluginProject(
      projectKey,
      Boolean(subtask),
      user,
    );
    return new ResponseSuccess("translations.ISSUE_LIST", response);
  }

  /**
   * Get issue types in plugin project
   */
  @Get("/issuetypes")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_ISSUE_TYPE_PLUGIN)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get issue types in plugin project",
  })
  async getAllIssueTypesInPluginProject(
    @Query("projectId") projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.getAllIssueTypesInPluginProject(
      projectId,
      user,
    );
    return new ResponseSuccess("translations.ISSUE_TYPES", response);
  }

  /**
   * Get users assignable to a plugin project
   */
  @Get("/users")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_USERS_IN_PLUGIN_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get users assignable to a plugin project",
  })
  async getAllUsersInPluginProject(
    @Query("projectId") projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.getAllUsersInPluginProject(
      projectId,
      user,
    );
    return new ResponseSuccess("translations.USER_LIST", response);
  }

  /**
   * Get sprints of the plugin project
   */
  @Get("/sprints")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.GET_SPRINTS_IN_PLUGIN_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get sprints of the plugin project",
  })
  async getSprintsInPluginProject(
    @Query("projectId") projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const response = await this.pluginService.getSprintsInPluginProject(
      projectId,
      user,
    );
    return new ResponseSuccess("translations.SPRINT_LIST", response);
  }
}
