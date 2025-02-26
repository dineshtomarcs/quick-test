import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  ValidationPipe,
  Body,
  Put,
  UseFilters,
  Param,
  Delete,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";

import { AuthUser } from "../../decorators/auth-user.decorator";
import { AuthGuard } from "../../guards/auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { TestCasesPageDto } from "./dto/TestCasesPageDto";
import { TestCasesPageOptionsDto } from "./dto/TestCasesPageOptionsDto";
import { UserEntity } from "../../service-users/user/user.entity";
import { TestCaseService } from "./test-case.service";
import { ResponseSuccess } from "../../common/dto/SuccessResponseDto";
import { EditTestCaseDto, editTestCaseSwagger } from "./dto/EditTestCaseDto";
import { UUIDCheckPipe } from "../../common/pipes/uuid-check.pipe";
import { ExceptionResponseFilter } from "../../common/filters/exception-response.filter";
import { TestCaseDto } from "./dto/TestCaseDto";
import { MultipleTestCaseDto } from "./dto/MultipleTestCaseDto";
import { SubscriptionAuthStatus } from "../../decorators/subscription-status.decorator";
import { PermissionsGuard } from "../../guards/permission.guard";
import { Permissions } from "../../decorators/permission.decorator";
import { Permission } from "../../common/constants/permissions";
import { OrgSubscriptionStatus } from "../../common/enums/org-subscription-status";
import { SubscriptionAuthGuard } from "../../guards/org.subscription.guard";

@Controller("test-cases")
@ApiTags("test-cases")
@UseFilters(ExceptionResponseFilter)
@UseGuards(AuthGuard, RolesGuard)
@ApiBearerAuth()
export class TestCaseController {
  constructor(private _testCaseService: TestCaseService) {}

  /**
   * Get all test cases
   */

  @Get()
  @UseGuards(SubscriptionAuthGuard)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get test-cases list",
    type: TestCasesPageDto,
  })
  async getTestCases(
    @Query(new ValidationPipe({ transform: true }))
    pageOptionsDto: TestCasesPageOptionsDto,
    @Query("projectId", UUIDCheckPipe) projectId: string,
  ): Promise<ResponseSuccess> {
    const testCases = await this._testCaseService.getTestCases(
      pageOptionsDto,
      projectId,
    );
    return new ResponseSuccess("translations.TSETCASES_LISTING", testCases);
  }

  /**
   * Get test case details by ID
   * @Param id
   */

  @Get("/:id")
  @UseGuards(SubscriptionAuthGuard)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Get test-cases details",
    type: TestCasesPageDto,
  })
  async getTestCase(@Param("id") testCaseId: string): Promise<ResponseSuccess> {
    const testCase = await this._testCaseService.getTestCase(testCaseId);
    return new ResponseSuccess("translations.TESTCASE_DETAILS", testCase);
  }

  /**
   * Delete test case
   */

  @Delete("/:id")
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.DELETE_TESTCASE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete test-case",
    type: TestCaseDto,
  })
  async deleteTestCase(
    @Param("id") testCaseId: string,
  ): Promise<ResponseSuccess> {
    await this._testCaseService.deleteTestCase(testCaseId);
    return new ResponseSuccess("translations.TESTCASE_DELETED", {});
  }

  /**
   * Delete multiple test cases
   */

  @Delete()
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.DELETE_TESTCASES)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Delete test-case",
    type: MultipleTestCaseDto,
  })
  async deleteMultipleTestCase(
    @Body() testCase: MultipleTestCaseDto,
  ): Promise<ResponseSuccess> {
    for (let i = 0; i < testCase.testCaseIds.length; i++) {
      await this._testCaseService.deleteTestCase(testCase.testCaseIds[i]);
    }
    return new ResponseSuccess("translations.TSESTCASES_DELETED", {});
  }

  /**
   * Edit test case details by ID
   * @Param testCaseId
   */

  @Put()
  @UseGuards(SubscriptionAuthGuard, PermissionsGuard)
  @Permissions(Permission.EDIT_TESTCASE)
  @SubscriptionAuthStatus(
    OrgSubscriptionStatus.active,
    OrgSubscriptionStatus.freeTrial,
    OrgSubscriptionStatus.cancelAtPeriodEnd,
  )
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Edit a TestCase by ID",
    type: EditTestCaseDto,
  })
  @ApiBody({ type: editTestCaseSwagger })
  async editTestCase(
    @Body("testCase")
    editTestCaseDto: EditTestCaseDto,
    @Body("sectionId") sectionId: string,
    @Body("testCaseId", UUIDCheckPipe) testCaseId: string,
    @AuthUser() user: UserEntity,
  ): Promise<ResponseSuccess> {
    const testCase = await this._testCaseService.editTestCase(
      editTestCaseDto,
      testCaseId,
      null,
      sectionId,
      user,
    );
    return new ResponseSuccess("translations.TESTCASE_EDITED", testCase);
  }
}
