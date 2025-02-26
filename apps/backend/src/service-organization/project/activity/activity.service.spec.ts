import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { ActivityEntity } from "./activity.entity";
import { ActivityService } from "./activity.service";
import { ActivityListDto } from "./dto/ActivityListDto";
import { ActivityEntityType } from "../../../common/enums/activity-entity";
import { ActivityListPageDto } from "./dto/ActivityListPageDto";
import { ActivityAction } from "../../../common/enums/activity-action";

const mockedActivityService = () => ({
  getProjectActivities: jest.fn(),
  getTestCaseResultActivities: jest.fn(),
  createMilestoneActivity: jest.fn(),
  createTestSuiteActivity: jest.fn(),
  createTestCaseResultActivity: jest.fn(),
  getAllTestCaseChangesActivities: jest.fn(),
  getTestCaseChangesActivitiesByProjects: jest.fn(),
});

const mockedMilestone: any = {
  id: "88998899-44f8-455e-b5ff-0da8a30a3f7c",
};

const mockedTestSuite: any = {
  id: "56265625-44f8-455e-b5ff-0da8a30a3f7c",
};

const mockedTestCaseResult: any = {
  id: "56265625-44f8-455e-b5ff-0da8a30a3f7c",
};

const mockedProject: any = {
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Project 1",
};

const mockedUser: any = {
  id: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
  firstName: "test",
  lastName: "lname",
  role: "USER",
  email: "singhail@yopmail.com",
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
    name: "keka",
  },
  profileImage: null,
  phone: null,
};

const mockedActivity: any = [
  {
    name: "Milestone 1",
    entity: ActivityEntityType.MILESTONE,
    status: "Created",
    userId: mockedUser.id,
    milestoneId: mockedMilestone.id,
    testSuiteId: null,
    testCaseResultId: null,
    projectId: mockedProject.id,
  },
  {
    name: "TestSuite 1",
    entity: ActivityEntityType.TESTRUN,
    status: "Created",
    userId: mockedUser.id,
    milestoneId: null,
    testSuiteId: mockedTestSuite.id,
    testCaseResultId: null,
    projectId: mockedProject.id,
  },
  {
    name: "TestCaseResult 1",
    entity: ActivityEntityType.TESTCASERESULT,
    status: "PASSED",
    action: "TESTED",
    userId: mockedUser.id,
    milestoneId: null,
    testSuiteId: null,
    testCaseResultId: mockedTestCaseResult.id,
    projectId: mockedProject.id,
  },
  {
    name: "TestCaseResult 2",
    entity: ActivityEntityType.TESTCASERESULT,
    status: "FAILED",
    action: "TESTED",
    userId: mockedUser.id,
    milestoneId: null,
    testSuiteId: null,
    testCaseResultId: mockedTestCaseResult.id,
    projectId: mockedProject.id,
  },
];

describe("ActivityService", () => {
  let activityService: ActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityService,
        {
          provide: ActivityService,
          useFactory: mockedActivityService,
        },
      ],
    }).compile();

    activityService = module.get<ActivityService>(ActivityService);
  });

  /**
   * Testing create milestone activity
   */
  describe("createMilestoneActivity", () => {
    it("should create a milestone activity", async () => {
      expect(mockedActivity[0]).toHaveProperty("name");
      expect(mockedActivity[0]).toHaveProperty("entity");
      expect(mockedActivity[0].entity).toBe(ActivityEntityType.MILESTONE);
      expect(mockedActivity[0]).toHaveProperty("status");
      expect(mockedActivity[0]).toHaveProperty("userId");
      expect(mockedActivity[0].userId).toBe(mockedUser.id);
      expect(mockedActivity[0]).toHaveProperty("projectId");
      expect(mockedActivity[0].projectId).toBe(mockedProject.id);
      expect(mockedActivity[0]).toHaveProperty("milestoneId");
      expect(mockedActivity[0].milestoneId).toBe(mockedMilestone.id);

      mocked(activityService.createMilestoneActivity).mockImplementation(() =>
        Promise.resolve(mockedActivity[0] as ActivityEntity),
      );

      expect(
        activityService.createMilestoneActivity(
          "Created",
          mockedMilestone,
          mockedProject,
          mockedUser,
        ),
      ).resolves.toBe(mockedActivity[0]);
    });
  });

  /**
   * Testing create test suite activity
   */

  describe("createTestSuiteActivity", () => {
    it("should create a test suite activity", async () => {
      expect(mockedActivity[1]).toHaveProperty("name");
      expect(mockedActivity[1]).toHaveProperty("entity");
      expect(mockedActivity[1].entity).toBe(ActivityEntityType.TESTRUN);
      expect(mockedActivity[1]).toHaveProperty("status");
      expect(mockedActivity[1]).toHaveProperty("userId");
      expect(mockedActivity[1].userId).toBe(mockedUser.id);
      expect(mockedActivity[1]).toHaveProperty("projectId");
      expect(mockedActivity[1].projectId).toBe(mockedProject.id);
      expect(mockedActivity[1]).toHaveProperty("testSuiteId");
      expect(mockedActivity[1].testSuiteId).toBe(mockedTestSuite.id);

      mocked(activityService.createTestSuiteActivity).mockImplementation(() =>
        Promise.resolve(mockedActivity[1] as ActivityEntity),
      );

      expect(
        activityService.createTestSuiteActivity(
          "Created",
          mockedTestSuite,
          mockedProject,
          mockedUser,
        ),
      ).resolves.toBe(mockedActivity[1]);
    });
  });

  /**
   * Testing create test case result activity
   */

  describe("createTestCaseResultActivity", () => {
    it("should create a test case result activity", async () => {
      expect(mockedActivity[2]).toHaveProperty("name");
      expect(mockedActivity[2]).toHaveProperty("entity");
      expect(mockedActivity[2].entity).toBe(ActivityEntityType.TESTCASERESULT);
      expect(mockedActivity[2]).toHaveProperty("status");
      expect(mockedActivity[2]).toHaveProperty("action");
      expect(mockedActivity[2]).toHaveProperty("userId");
      expect(mockedActivity[2].userId).toBe(mockedUser.id);
      expect(mockedActivity[2]).toHaveProperty("testCaseResultId");
      expect(mockedActivity[2].testCaseResultId).toBe(mockedTestCaseResult.id);

      mocked(activityService.createTestCaseResultActivity).mockImplementation(
        () => Promise.resolve(mockedActivity[2] as ActivityEntity),
      );

      expect(
        activityService.createTestCaseResultActivity(
          "Passed",
          ActivityAction.COMMENT,
          mockedTestCaseResult,
          mockedTestSuite,
          mockedProject,
          mockedUser,
        ),
      ).resolves.toBe(mockedActivity[2]);
    });
  });

  /**
   * Testing Get project activities
   */

  describe("getProjectActivities", () => {
    it("should return error for project not found", async () => {
      mocked(activityService.getProjectActivities).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      expect(
        activityService.getProjectActivities(
          "98989871-44f8-455e-b5ff-0da8a30a3f7c",
          null,
          mockedUser,
        ),
      ).rejects.toThrow("Project not found");
    });

    it("should find all project activities", async () => {
      mocked(activityService.getProjectActivities).mockImplementation(() =>
        Promise.resolve(mockedActivity.slice(0, 2) as ActivityListDto),
      );

      expect(
        activityService.getProjectActivities(
          mockedProject.id,
          null,
          mockedUser,
        ),
      ).resolves.toStrictEqual(mockedActivity.slice(0, 2));
    });
  });

  /**
   * Testing Get test case result activities
   */

  describe("getTestCaseResultActivities", () => {
    it("should return error for project not found", async () => {
      mocked(activityService.getTestCaseResultActivities).mockImplementation(
        () => Promise.reject(new Error("Project not found")),
      );

      expect(
        activityService.getTestCaseResultActivities(
          "98989871-44f8-455e-b5ff-0da8a30a3f7c",
          null,
          mockedUser,
        ),
      ).rejects.toThrow("Project not found");
    });

    it("should find all test case result activities", async () => {
      mocked(activityService.getTestCaseResultActivities).mockImplementation(
        () => Promise.resolve(mockedActivity[2]),
      );

      expect(
        activityService.getTestCaseResultActivities(
          mockedProject.id,
          null,
          mockedUser,
        ),
      ).resolves.toBe(mockedActivity[2]);
    });
  });

  /**
   * Testing Get all test case changes activities
   */

  describe("getAllTestCaseChangesActivities", () => {
    it("should return error for project not found", async () => {
      mocked(
        activityService.getAllTestCaseChangesActivities,
      ).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      expect(
        activityService.getAllTestCaseChangesActivities(
          "98989871-44f8-455e-b5ff-0da8a30a3f7c",
          null,
          mockedUser,
        ),
      ).rejects.toThrow("Project not found");
    });

    it("should find all test case changes activities", async () => {
      const mockedTestChangeActivities = mockedActivity.filter(
        (activity) => activity.entity === ActivityEntityType.TESTCASERESULT,
      );

      mocked(
        activityService.getAllTestCaseChangesActivities,
      ).mockImplementation(() =>
        Promise.resolve(mockedTestChangeActivities as ActivityListPageDto),
      );

      expect(
        activityService.getAllTestCaseChangesActivities(
          mockedProject.id,
          null,
          mockedUser,
        ),
      ).resolves.toStrictEqual(mockedTestChangeActivities);
    });
  });

  /**
   * Testing Get testcase changes activities for a project
   */

  describe("getTestCaseChangesActivitiesByProjects", () => {
    it("should find testcase changes activities for projects", async () => {
      const projectIds = [mockedProject.id];
      const mockedTestChangeActivities = mockedActivity.filter(
        (activity) => activity.entity === ActivityEntityType.TESTCASERESULT,
      );

      mocked(
        activityService.getTestCaseChangesActivitiesByProjects,
      ).mockImplementation(() =>
        Promise.resolve(mockedTestChangeActivities as ActivityListDto),
      );

      const mockedPageOption: any = {
        days: 7,
      };

      expect(
        activityService.getTestCaseChangesActivitiesByProjects(
          projectIds,
          mockedPageOption,
        ),
      ).resolves.toStrictEqual(mockedTestChangeActivities);
    });
  });
});
