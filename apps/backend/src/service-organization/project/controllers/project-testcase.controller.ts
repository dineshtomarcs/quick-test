import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Post,
  Body,
  Put,
  UseFilters,
  Param,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { UserEntity } from "../../../service-users/user/user.entity";
import { AuthGuard } from "../../../guards/auth.guard";
import { RolesGuard } from "../../../guards/roles.guard";
import { ProjectsPageDto } from "../dto/ProjectsPageDto";
import { ProjectCreateService } from "../services/create.service";
import { ProjectUpdateService } from "../services/update.service";
import { ProjectReadService } from "../services/read.service";
import { ResponseSuccess } from "../../../common/dto/SuccessResponseDto";
import { UUIDCheckPipe } from "../../../common/pipes/uuid-check.pipe";
import { ExceptionResponseFilter } from "../../../common/filters/exception-response.filter";
import {
  CreateTestCaseDto,
  createTestCaseSwagger,
  testCaseIdsSwagger,
} from "../../test-case/dto/CreateTestCaseDto";
import { EditTestCaseDto } from "../../test-case/dto/EditTestCaseDto";
import { MultipleTestCaseDto } from "../../test-case/dto/MultipleTestCaseDto";
import { TestCaseDetailsDto } from "../../test-case/dto/TestCaseDetailsDto";
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
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class TestcaseRelatedProjectController {
  constructor(
    private _projectReadService: ProjectReadService,
    private _projectUpdateService: ProjectUpdateService,
    private _projectCreateService: ProjectCreateService,
  ) {}

  /**
   * Create a test case for a Project
   *  @Param id
   */

  @Post("/:id/test-cases")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.CREATE_PROJECT_TESTCASE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Creates a new TestCase",
    type: CreateTestCaseDto,
  })
  @ApiBody({ type: createTestCaseSwagger })
  async createTestCase(
    @Body("testcase")
    createTestCaseDto: CreateTestCaseDto,
    @Body("sectionId") sectionId: string,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._projectCreateService.createTestCase(
      createTestCaseDto,
      projectId,
      sectionId,
      user,
    );
    return new ResponseSuccess("translations.TESTCASE_CREATED", testCase);
  }

  /**
   * Add pdf of the test cases
   *  @Param id
   */
  @Post("/:id/test-cases/pdf")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.ADD_TESTCASE_PDF)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Add pdf of the test cases",
  })
  @ApiBody({ type: testCaseIdsSwagger })
  async addTestCasesPdf(
    @Param("id", UUIDCheckPipe) projectId: string,
    @Body("testCaseIds") testCaseIds: string[],
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const pdfLink = await this._projectCreateService.addTestCasesPdf(
      projectId,
      testCaseIds,
      user,
    );
    return new ResponseSuccess(`translations.TESTCASE_PDF`, pdfLink);
  }

  /**
   * Get a single TestCase
   *  @Param id
   *  @Param testCaseId
   */

  @Get("/:id/test-cases/:testCaseId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_PROJECT_TESTCASE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get a test case",
    type: CreateTestCaseDto,
  })
  async getTestCase(
    @Param("testCaseId", UUIDCheckPipe) testCaseId: string,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._projectReadService.getTestCase(
      testCaseId,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.TESTCASE_DETAILS", testCase);
  }

  /**
   * Edit a TestCase
   *  @Param id
   *  @Param testCaseId
   */
  @Put("/:id/test-cases/:testCaseId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.EDIT_TESTCASE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Edit an existing TestCase",
    type: CreateTestCaseDto,
  })
  async editTestCase(
    @Body()
    editTestCaseDto: EditTestCaseDto,
    @Body("sectionId") sectionId: string,
    @Param("testCaseId", UUIDCheckPipe) testCaseId: string,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._projectUpdateService.editTestCase(
      editTestCaseDto,
      testCaseId,
      projectId,
      sectionId,
      user,
    );
    return new ResponseSuccess("translations.TESTCASE_UPDATED", testCase);
  }

  /**
   * Edit Multiple TestCase
   *  @Param id
   */
  @Put("/:id/test-cases")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.EDIT_MULTIPLE_TESTCASES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Edit an existing TestCase",
    type: CreateTestCaseDto,
  })
  async editMultipleTestCase(
    @Body("value")
    editTestCaseDto: EditTestCaseDto,
    @Body("sectionId") sectionId: string,
    @Body() testCases: MultipleTestCaseDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    await this._projectUpdateService.editMultipleTestCases(
      editTestCaseDto,
      testCases.testCaseIds,
      projectId,
      sectionId,
      user,
    );
    return new ResponseSuccess("translations.TESTCASES_UPDATED", {});
  }

  /**
   * Get listing of Test cases for a project
   *  @Param id
   */
  @Get("/:id/test-cases")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.LISTING_PROJECT_TESTCASES)
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
  async getTestCases(
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const project = await this._projectReadService.getSectionsWithTestcases(
      projectId,
      user,
    );
    return new ResponseSuccess(`translations.TESTCASE_LISTING`, project);
  }

  /**
   * Get test case details by test case internal id
   * @param id
   * @Param testCaseId
   */
  @Get("/:id/test-cases/:testCaseId/details")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_TESTCASE_DETAILS)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get test case details by test case internal id",
    type: TestCaseDetailsDto,
  })
  async getTestCaseByInternalId(
    @Param("id", UUIDCheckPipe) projectId: string,
    @Param("testCaseId", ParseIntPipe) testCaseId: number,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._projectReadService.getTestCaseByInternalId(
      projectId,
      testCaseId,
      user,
    );
    return new ResponseSuccess("translations.TESTCASE_DETAILS", testCase);
  }
}
