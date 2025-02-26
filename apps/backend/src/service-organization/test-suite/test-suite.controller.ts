import {
  Controller,
  Get,
  HttpCode,
  Query,
  HttpStatus,
  ValidationPipe,
  Body,
  UseGuards,
  UseFilters,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthUser } from "../../decorators/auth-user.decorator";
import { UserEntity } from "../../service-users/user/user.entity";
import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { CreateTestCaseResultDto } from "./test-case-result/dto/CreateTestCaseResultDto";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { TestCaseResultService } from "./test-case-result/test-case-result.service";
import { TestSuitesPageDto } from "./dto/TestSuitesPageDto";
import { TestSuiteService } from "./test-suite.service";
import { EditTestResultDto } from "./test-case-result/dto/EditTestResultDto";
import { TestCaseResultPageOptionsDto } from "./test-case-result/dto/TestCaseResultPageOptionDto";
import { TestSuiteDto } from "./dto/TestSuiteDto";
import { TestCaseResultDto } from "./test-case-result/dto/TestCaseResultDto";
import { SubscriptionAuthStatus } from "../../decorators/subscription-status.decorator";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permission } from "../../common/constants/permissions";
import { Permissions } from "../../decorators/permission.decorator";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../guards/org.subscription.guard";

@Controller("test-suites")
@ApiTags("test-suites")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class TestSuitesController {
  constructor(
    private readonly _testCaseResultService: TestCaseResultService,
    private readonly _testSuiteService: TestSuiteService,
  ) {}

  /**
   * submit test case result
   * @Param testResultId
   */
  @Put("/test-results/:testResultId")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.EDIT_TESTCASE_RESULT)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Creates a new Test result",
    type: CreateTestCaseResultDto,
  })
  async editTestCaseResult(
    @Body()
    editTestCaseResultDto: EditTestResultDto,
    @Param("testResultId", UUIDCheckPipe) testResultId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._testCaseResultService.editTestCaseResult(
      editTestCaseResultDto,
      testResultId,
      user,
    );
    return new ResponseSuccess(
      "translations.TESTCASE_RESULT_SUBMITTED",
      testCase.toDto(),
    );
  }

  /**
   * Get test Result
   * @Param id
   */
  @Get("/:id/test-results")
  @UseGuards(SubscriptionAuthGuard)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get test result list",
    type: TestSuitesPageDto,
  })
  async getTestResults(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TestCaseResultPageOptionsDto,
    @Param("id") testSuitesId: string,
  ): Promise<ResponseSuccess> {
    const testResultList = await this._testSuiteService.getTestResults(
      pageOptionsDto,
      testSuitesId,
    );
    return new ResponseSuccess(
      "translations.TESTCASE_RESULT_LIST",
      testResultList,
    );
  }

  /**
   * Get test result details by ID
   * @Param id
   */

  @Get("/:id/test-result")
  @UseGuards(SubscriptionAuthGuard)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get test-result details",
    type: TestCaseResultDto,
  })
  async getTestCase(
    @Param("id") testResultId: string,
  ): Promise<ResponseSuccess> {
    const testResult =
      await this._testCaseResultService.getTestResult(testResultId);
    return new ResponseSuccess("translations.TEST_RESULT_DETAILS", testResult);
  }

  /**
   * Delete a Test Run
   * @Param id
   */

  @Delete("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.DELETE_TESTSUITES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete a testSuite",
    type: TestSuiteDto,
  })
  async deleteTestSuite(
    @Param("id") testSuiteId: string,
  ): Promise<ResponseSuccess> {
    await this._testSuiteService.deleteTestSuite(testSuiteId);
    return new ResponseSuccess("translations.TEST_RUN_DELETED", {});
  }
}
