import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ValidationPipe,
  Post,
  Body,
  Put,
  UseFilters,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Patch,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

import { IFile } from "../../../interfaces/IFile";
import { AuthUser } from "../../../decorators/auth-user.decorator";
import { UserEntity } from "../../../service-users/user/user.entity";
import { AuthGuard } from "../../../guards/auth.guard";
import { ProjectsPageDto } from "../dto/ProjectsPageDto";
import { ProjectsPageOptionsDto } from "../dto/ProjectsPageOptionsDto";
import { ProjectCreateService } from "../services/create.service";
import { ProjectDeleteService } from "../services/delete.service";
import { ProjectUpdateService } from "../services/update.service";
import { ProjectReadService } from "../services/read.service";
import { ResponseSuccess } from "../../../common/dto/SuccessResponseDto";
import { CreateProjectDto } from "../dto/CreateProjectDto";
import { EditProjectDto, editProjectSwagger } from "../dto/EditProjectDto";
import { UUIDCheckPipe } from "../../../common/pipes/uuid-check.pipe";
import { ExceptionResponseFilter } from "../../../common/filters/exception-response.filter";
import { ProjectDto } from "../dto/ProjectDto";
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
export class ProjectController {
  constructor(
    private _projectReadService: ProjectReadService,
    private _projectUpdateService: ProjectUpdateService,
    private _projectDeleteService: ProjectDeleteService,
    private _projectCreateService: ProjectCreateService,
  ) {}

  /**
   * Create a new Project
   */
  @Post()
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.CREATE_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Creates a new Project",
    type: CreateProjectDto,
  })
  async createProject(
    @Body()
    createProjectDto: CreateProjectDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const projects = await this._projectCreateService.createProject(
      createProjectDto,
      user,
    );
    return new ResponseSuccess("translations.PROJECT_CREATED", projects);
  }

  /**
   * Edit a project by ID
   */
  @Put("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.EDIT_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Edit a Project by ID",
    type: EditProjectDto,
  })
  @ApiBody({ type: editProjectSwagger })
  async editProject(
    @Body("project")
    editProjectDto: EditProjectDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const project = await this._projectUpdateService.editProject(
      editProjectDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.PROJECT_UPDATED", project);
  }

  /**
   * Get project Details by ID
   */
  @Get("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_PROJECT_DETAILS)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get project Details",
    type: ProjectsPageDto,
  })
  async getProject(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const project = await this._projectReadService.getProject(projectId, user);
    return new ResponseSuccess("translations.PROJECT_DETAILS", project);
  }

  /**
   * Archive a Project
   */

  @Delete("/:id/archive")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.ARCHIVE_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Archive a project",
    type: ProjectDto,
  })
  async archiveProject(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    await this._projectDeleteService.archiveProject(projectId, user);
    return new ResponseSuccess("translations.PROJECT_ARCHIVED", {});
  }

  /**
   * Restore a Project
   */

  @Patch("/:id/restore")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.RESTORE_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Restore a project",
    type: ProjectDto,
  })
  async restoreProject(
    @Param("id", UUIDCheckPipe) projectId: string,
  ): Promise<ResponseSuccess> {
    await this._projectUpdateService.restoreProject(projectId);
    return new ResponseSuccess("translations.PROJECT_RESTORED", { projectId });
  }

  /**
   * Delete a Project
   */

  @Delete("/:id/delete")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.DELETE_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete a project",
    type: ProjectDto,
  })
  async deleteProject(
    @Param("id", UUIDCheckPipe) projectId: string,
  ): Promise<ResponseSuccess> {
    await this._projectDeleteService.deleteProject(projectId);
    return new ResponseSuccess("translations.PROJECT_DELETED", {});
  }

  /**
   * Get Project Listing
   */
  @Get()
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_PROJECT_LISTING)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get projects list",
    type: ProjectsPageDto,
  })
  async getProjects(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: ProjectsPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const projects = await this._projectReadService.getProjects(
      pageOptionsDto,
      user,
    );
    return new ResponseSuccess("translations.PROJECTS_LISTING", projects);
  }

  /**
   * Upload image for a project
   */
  @Post("/image")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.UPLOAD_IMAGE_PROJECT)
  @UseInterceptors(
    FileInterceptor("file", {
      limits: { fileSize: 1e6 }, // payload size limit 1 MB
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Upload image for a project",
  })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  async uploadProjectImage(
    @UploadedFile() file: IFile,
  ): Promise<ResponseSuccess> {
    const status = await this._projectCreateService.uploadProjectImage(file);
    return new ResponseSuccess("translations.IMAGE_UPLOADED", status);
  }

  /**
   * Get todo list of test runs for members
   */
  @Get("/:id/todo")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_PROJECT_TODO)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get todo list of test runs for members",
  })
  async getProjectTodo(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const res = await this._projectReadService.getProjectTodo(projectId, user);
    return new ResponseSuccess("translations.PROJECT_TODO_LIST", {
      users: res.users,
      testRuns: res.testSuiteList,
    });
  }

  /**
   * testCase filter users
   *  @Param id
   */
  @Get("/:id/filter-users")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_TESTCASE_ACTIVITY_USER)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get project Details",
    type: ProjectsPageDto,
  })
  async getTestCaseActivityUser(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const users = await this._projectReadService.getTestCaseActivityUser(
      projectId,
      user,
    );
    return new ResponseSuccess(`translations.TESTCASES_LISTING`, users);
  }

  /**
   * Get all favorite projects of user
   */
  @Get("/favorites/list")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_FAVORITE_PROJECTS)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all favorite projects of user",
  })
  async getFavoriteProjects(
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const favoriteProjects =
      await this._projectReadService.getFavoriteProjects(user);
    return new ResponseSuccess(
      "translations.FAVORITE_PROJECTS",
      favoriteProjects,
    );
  }

  /**
   * Post favorite project
   */
  @Post("/:id/favorites")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.ADD_FAVORITE_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Post favorite project",
  })
  async addFavoriteProject(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const favoriteProject = await this._projectCreateService.addFavoriteProject(
      projectId,
      user,
    );
    return new ResponseSuccess(
      "translations.FAVORITE_PROJECT_CREATED",
      favoriteProject,
    );
  }

  /**
   * Remove favorite project
   */
  @Delete("/:id/favorites")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.DELETE_FAVORITE_PROJECT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Remove favorite project",
  })
  async removeFavoriteProject(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const favoriteProject =
      await this._projectDeleteService.removeFavoriteProject(projectId, user);
    return new ResponseSuccess(
      "translations.FAVORITE_PROJECT_REMOVED",
      favoriteProject,
    );
  }
}
