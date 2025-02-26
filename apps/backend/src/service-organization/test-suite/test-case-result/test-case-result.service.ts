import { Injectable, NotFoundException } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { FindOptionsWhere, Repository } from "typeorm";

import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../../service-users/user/user.entity";
import { ValidatorService } from "../../../shared/services/validator.service";
import { EditTestResultDto } from "./dto/EditTestResultDto";
import { CreateTestCaseResultDto } from "./dto/CreateTestCaseResultDto";
import { TestCaseResultEntity } from "./test-case-result.entity";

import { TestCaseService } from "../../test-case/test-case.service";

import { TestSuiteService } from "../test-suite.service";
import { TestCaseResultStatus } from "../../../common/enums/test-case-result-status";
import { TestCaseResultDto } from "./dto/TestCaseResultDto";

import { ActivityService } from "../../project/activity/activity.service";
import { ActivityAction } from "../../../common/enums/activity-action";
import { TestSuiteEntity } from "../test-suite.entity";
import { TestCaseEntity } from "../../test-case/test-case.entity";
import { DefectService } from "../../defect/defect.service";

@Injectable()
export class TestCaseResultService {
  public testSuiteService: TestSuiteService;

  public testCaseService: TestCaseService;

  public activityService: ActivityService;

  public defectService: DefectService;

  constructor(
    @InjectRepository(TestCaseResultEntity)
    public readonly testCaseResultRepository: Repository<TestCaseResultEntity>,
    @InjectRepository(TestSuiteEntity)
    public readonly testSuiteRepository: Repository<TestSuiteEntity>,
    public readonly validatorService: ValidatorService,
    public readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.testSuiteService = this.moduleRef.get(TestSuiteService, {
      strict: false,
    });
    this.testCaseService = this.moduleRef.get(TestCaseService, {
      strict: false,
    });
    this.activityService = this.moduleRef.get(ActivityService, {
      strict: false,
    });
    this.defectService = this.moduleRef.get(DefectService, {
      strict: false,
    });
  }

  /**
   * Find single testCase
   */
  findOne(
    findData: FindOptionsWhere<TestCaseResultEntity>,
  ): Promise<TestCaseResultEntity> {
    return this.testCaseResultRepository.findOneBy(findData);
  }

  /**
   * Create Test case result
   */

  async createTestCaseResult(
    createTestCaseResultDto: CreateTestCaseResultDto,
    testSuite: TestSuiteEntity,
    testCase: TestCaseEntity,
  ): Promise<TestCaseResultEntity> {
    const testCaseResult = this.testCaseResultRepository.create(
      createTestCaseResultDto,
    );
    if (!testSuite)
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    if (!testCase) throw new NotFoundException("translations.RECORD_NOT_FOUND");

    testCaseResult.testsuite = testSuite;
    testCaseResult.testCaseTitle = testCase.title;
    testCaseResult.testCaseId = testCase.testcaseId;
    testCaseResult.testCaseExecutionPriority = testCase.executionPriority;
    testCaseResult.testCasePreconditions = testCase.preconditions;
    testCaseResult.testCaseSteps = testCase.steps;
    testCaseResult.testCaseExpectedResults = testCase.expectedResults;
    testCaseResult.sectionName = testCase.section
      ? testCase.section.name
      : "Unassigned";
    testCaseResult.sectionDescription = testCase.section?.description;
    if (testCase?.id)
      testCaseResult.defect = (
        await this.testCaseService.findOne({ id: testCase?.id })
      )?.defect;
    const testCaseResultData =
      await this.testCaseResultRepository.save(testCaseResult);
    return testCaseResultData;
  }

  /**
   * Update test case result
   */

  async editTestCaseResult(
    editTestResultDto: EditTestResultDto,
    testResultId: string,
    user: UserEntity,
  ): Promise<TestCaseResultEntity> {
    const testCaseResult = await this.testCaseResultRepository
      .createQueryBuilder("testCaseResult")
      .leftJoinAndSelect("testCaseResult.testsuite", "testsuite")
      .leftJoinAndSelect("testCaseResult.defect", "defect")
      .where("testCaseResult.id = :testResultId", { testResultId })
      .getOne();
    if (!testCaseResult)
      throw new NotFoundException("translations.RECORD_NOT_FOUND");

    const testSuite = await this.testSuiteRepository
      .createQueryBuilder("testsuite")
      .leftJoinAndSelect("testsuite.project", "project")
      .where("testsuite.id = :id", { id: testCaseResult.testsuite?.id })
      .getOne();
    if (editTestResultDto?.status) {
      testCaseResult.status = TestCaseResultStatus[editTestResultDto.status];
      await this.activityService.createTestCaseResultActivity(
        testCaseResult.status,
        ActivityAction[testCaseResult.status],
        testCaseResult,
        testSuite,
        testSuite?.project,
        user,
      );
    }
    if (editTestResultDto?.comment) {
      testCaseResult.comment = editTestResultDto.comment;
      await this.activityService.createTestCaseResultActivity(
        "COMMENT",
        ActivityAction.COMMENT,
        testCaseResult,
        testSuite,
        testSuite?.project,
        user,
      );
    }
    if (editTestResultDto?.image)
      testCaseResult.image = editTestResultDto.image;
    const testCaseResultData =
      await this.testCaseResultRepository.save(testCaseResult);
    await this.testSuiteService.editTestSuiteReport(
      testCaseResultData.testSuiteId,
      user,
    );
    if (editTestResultDto?.addCommentJira) {
      await this.defectService.addDefectComment(
        testCaseResultData.defect,
        editTestResultDto,
        user,
      );
    }
    return testCaseResultData;
  }

  /**
   * Find single testCase
   */

  async getTestResult(testResultId: string): Promise<TestCaseResultDto> {
    const testResult = await this.testCaseResultRepository
      .createQueryBuilder("testCaseResult")
      .leftJoinAndSelect("testCaseResult.testsuite", "testsuite")
      .leftJoinAndSelect("testCaseResult.defect", "defect")
      .where("testCaseResult.id = :testResultId", { testResultId })
      .getOne();
    if (!testResult)
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    return new TestCaseResultDto(testResult);
  }
}
