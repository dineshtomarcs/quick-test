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
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthUser } from "../../../decorators/auth-user.decorator";
import { UserEntity } from "../../../service-users/user/user.entity";
import { AuthGuard } from "../../../guards/auth.guard";
import { RolesGuard } from "../../../guards/roles.guard";
import { ProjectCreateService } from "../services/create.service";
import { ProjectUpdateService } from "../services/update.service";
import { ProjectReadService } from "../services/read.service";
import { ResponseSuccess } from "../../../common/dto/SuccessResponseDto";
import { UUIDCheckPipe } from "../../../common/pipes/uuid-check.pipe";
import { ExceptionResponseFilter } from "../../../common/filters/exception-response.filter";
import { TestSuitePageOptionsDto } from "../../test-suite/dto/TestSuitePageOptionDto";
import { TestSuitesPageDto } from "../../test-suite/dto/TestSuitesPageDto";
import {
  CreateTestSuiteDto,
  CreateTestSuiteSwagger,
  testSuiteIdsSwagger,
} from "../../test-suite/dto/CreateTestSuiteDto";
import { EditTestSuiteDto } from "../../test-suite/dto/EditTestSuiteDto";
import { TestSuiteDto } from "../../test-suite/dto/TestSuiteDto";
import {
  CreateFilteredTestSuiteDto,
  CreateFilteredTestSuiteSwagger,
} from "../../test-suite/dto/CreateFilteredTestSuiteDto";
import { SubscriptionAuthStatus } from "../../../decorators/subscription-status.decorator";
import { PermissionsGuard } from "../../../guards/permission.guard";
import { Permission } from "../../../common/constants/permissions";
import { Permissions } from "../../../decorators/permission.decorator";
import { OrgSubscriptionStatus } from "../../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../../guards/org.subscription.guard";
import { ProjectAuthGuard } from "../../../guards/projectAuth.guard";

@Controller("projects")
@ApiTags("projects")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class TestsuiteRelatedProjectController {
  constructor(
    private _projectReadService: ProjectReadService,
    private _projectUpdateService: ProjectUpdateService,
    private _projectCreateService: ProjectCreateService,
  ) {}

  /**
   * Add pdf of the test suites
   *  @Param id
   */
  @Post("/:id/test-suites/pdf")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.ADD_TESTSUITE_PDF)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Add pdf of the test suites",
  })
  @ApiBody({ type: testSuiteIdsSwagger })
  async addTestSuitesPdf(
    @Param("id", UUIDCheckPipe) projectId: string,
    @Body("testSuiteIds") testSuiteIds: string[],
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const pdfLink = await this._projectCreateService.addTestSuitesPdf(
      projectId,
      testSuiteIds,
      user,
    );
    return new ResponseSuccess(`translations.TESTSUITES_PDF`, pdfLink);
  }

  /**
   * Download pdf of the test suite result
   *  @Param id
   */
  @Post("/:id/test-suites/:testSuiteId/pdf")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.ADD_TESTSUITE_RESULT_PDF)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Download pdf of the test suite result",
  })
  async addTestSuiteResultPdf(
    @Param("id", UUIDCheckPipe) projectId: string,
    @Param("testSuiteId", UUIDCheckPipe) testSuiteId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const pdfLink = await this._projectCreateService.addTestSuiteResultPdf(
      projectId,
      testSuiteId,
      user,
    );
    return new ResponseSuccess(`translations.TESTSUITE_RESULTS_PDF`, pdfLink);
  }

  /**
   * Create a test suite for a Project
   * @Param id
   */
  @Post("/:id/test-suites")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.CREATE_PROJECT_TESTSUITES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Creates a new Test Suite",
    type: CreateTestSuiteDto,
  })
  @ApiBody({ type: CreateTestSuiteSwagger })
  async createTestSuite(
    @Body("testSuite")
    createTestSuiteDto: CreateTestSuiteDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._projectCreateService.createTestSuite(
      createTestSuiteDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.TESTRUN_CREATED", testCase);
  }

  /**
   * Create a test suite for a Project with filtered
   * sections and test cases
   * @Param id
   */
  @Post("/:id/test-suites/filtered")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.CREATE_FILTERED_TESTSUITES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      "Creates a new Test Suite with filtered sections and test cases",
    type: CreateFilteredTestSuiteDto,
  })
  @ApiBody({ type: CreateFilteredTestSuiteSwagger })
  async createFilteredTestSuite(
    @Body("testSuite")
    createFilteredTestSuiteDto: CreateFilteredTestSuiteDto,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const res = await this._projectCreateService.createFilteredTestSuite(
      createFilteredTestSuiteDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.TESTRUN_CREATED", res);
  }

  /**
   * Edit a Test Suite
   *  @Param id
   *  @Param testSuiteId
   */
  @Put("/:id/test-suite/:testSuiteId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.EDIT_TESTSUITES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Edit an existing Test Suite",
    type: CreateTestSuiteDto,
  })
  async editTestSuite(
    @Body()
    editTestSuiteDto: EditTestSuiteDto,
    @Param("testSuiteId", UUIDCheckPipe) testSuiteId: string,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._projectUpdateService.editTestSuite(
      editTestSuiteDto,
      testSuiteId,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.TESTRUN_UPDATED", testCase);
  }

  /**
   * Get a single Test Suite
   *  @Param id
   *  @Param testSuiteId
   */
  @Get("/:id/test-suite-detail/:testSuiteId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_TESTSUITE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Get Test suite detail",
    type: TestSuiteDto,
  })
  async getTestSuiteDetail(
    @Param("testSuiteId", UUIDCheckPipe) testSuiteId: string,
    @Param("id", UUIDCheckPipe) projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testSuite = await this._projectReadService.getTestSuiteDetail(
      testSuiteId,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.TESTSUITES_DETAILS", testSuite);
  }

  /**
   * Get test Suites
   * @Param id
   */
  @Get("/:id/test-suites")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard, ProjectAuthGuard)
  @Permissions(Permission.GET_TESTSUITES)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get test suites details",
    type: TestSuitesPageDto,
  })
  async getTestSuites(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TestSuitePageOptionsDto,
    @Param("id") projectId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testSuites = await this._projectReadService.getTestSuites(
      pageOptionsDto,
      projectId,
      user,
    );
    return new ResponseSuccess("translations.TESTSUITE_LIST", testSuites);
  }
}
