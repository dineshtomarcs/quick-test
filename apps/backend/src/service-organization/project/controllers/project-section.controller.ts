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
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { UserEntity } from "../../../service-users/user/user.entity";
import { AuthGuard } from "../../../guards/auth.guard";
import { ProjectCreateService } from "../services/create.service";
import { ProjectDeleteService } from "../services/delete.service";
import { ProjectUpdateService } from "../services/update.service";
import { ProjectReadService } from "../services/read.service";
import { ResponseSuccess } from "../../../common/dto/SuccessResponseDto";
import { UUIDCheckPipe } from "../../../common/pipes/uuid-check.pipe";
import { ExceptionResponseFilter } from "../../../common/filters/exception-response.filter";
import { EditTestCaseDto } from "../../test-case/dto/EditTestCaseDto";
import { CreateSectionDto } from "../../test-case/section/dto/CreateSectionDto";
import {
  EditSectionDto,
  reOrderTestCasesSwagger,
} from "../../test-case/section/dto/EditSectionDto";
import { SectionPageDto } from "../../test-case/section/dto/SectionPageDto";
import { SectionPageOptionsDto } from "../../test-case/section/dto/SectionPageOptionsDto";
import { SectionDto } from "../../test-case/section/dto/SectionDto";
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
export class SectionRelatedProjectController {
  constructor(
    private _projectReadService: ProjectReadService,
    private _projectUpdateService: ProjectUpdateService,
    private _projectDeleteService: ProjectDeleteService,
    private _projectCreateService: ProjectCreateService,
  ) {}

  /**
   * Post a section for project
   * @Param iD
   */
  @Post("/:id/sections")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.CREATE_SECTION)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Post test case section",
    type: CreateSectionDto,
  })
  async addSection(
    @Body() createSectionDto: CreateSectionDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const section = await this._projectCreateService.addSection(
      createSectionDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.SECTION_CREATED", section.toDto());
  }

  /**
   * Update section
   * @Param iD
   * @Param sectionID
   */
  @Put("/:id/sections/:sectionId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.UPDATE_SECTION)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Update test case section",
    type: EditSectionDto,
  })
  async editSection(
    @Body() editSectionDto: EditSectionDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @Param("sectionId", UUIDCheckPipe) sectionId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const section = await this._projectUpdateService.editSection(
      editSectionDto,
      sectionId,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.SECTION_UPDATED", section.toDto());
  }

  /**
   * Get all sections of project
   * @Param id
   */
  @Get("/:id/sections")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_ALL_SECTION)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get all sections for a project",
    type: SectionPageDto,
  })
  async getAllSections(
    @Param("id", UUIDCheckPipe) projectId: string,
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    pageOptionsDto: SectionPageOptionsDto,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const sectionList = await this._projectReadService.getAllSections(
      pageOptionsDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.SECTION_LIST", sectionList);
  }

  /**
   * Delete a section
   */

  @Delete("/:id/sections/:sectionId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.DELETE_SECTION)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete a section",
    type: SectionDto,
  })
  async deleteSection(
    @Param("id", UUIDCheckPipe) projectId: string,
    @Param("sectionId", UUIDCheckPipe) sectionId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    await this._projectDeleteService.deleteSection(projectId, sectionId, user);
    return new ResponseSuccess("translations.SECTION_DELETED", {});
  }

  /**
   * Re order testCases in a section for a Project
   * @Param testCaseId
   * @Param sectionId
   * @Param newPosition
   */

  @Post("/:id/sections/:sectionId/re-order")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.REORDER_TESTCASES_SECTION)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Re-order testcases in a section in a project",
    type: EditTestCaseDto,
  })
  @ApiBody({ type: reOrderTestCasesSwagger })
  async reOrderTestCasesInASection(
    @Param("sectionId", UUIDCheckPipe) sectionId: string,
    @Body("testCaseId", UUIDCheckPipe) testCaseId: string,
    @Body("newPosition") newPosition: number,
  ): Promise<ResponseSuccess> {
    const status = await this._projectUpdateService.reOrderTestCaseRequest(
      sectionId,
      testCaseId,
      newPosition,
    );
    return new ResponseSuccess("translations.TESTCASE_REORDERED", status);
  }
}
