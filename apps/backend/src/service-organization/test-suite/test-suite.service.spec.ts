import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { TestCaseService } from "../test-case/test-case.service";
import { TestCaseResultEntity } from "./test-case-result/test-case-result.entity";
import { TestCaseResultService } from "./test-case-result/test-case-result.service";
import { ProjectReadService } from "../project/services/read.service";
import { TestSuiteEntity } from "./test-suite.entity";
import { TestSuiteService } from "./test-suite.service";
import { TestSuitesPageDto } from "./dto/TestSuitesPageDto";
import { TestcasesResultsPageDto } from "./test-case-result/dto/TestCasesResultsPageDto";
import { TestSuitePageOptionsDto } from "./dto/TestSuitePageOptionDto";
import { TestCaseResultPageOptionsDto } from "./test-case-result/dto/TestCaseResultPageOptionDto";
import { TestSuiteTodoListDto } from "./dto/TestSuiteTodoListDto";
import { TestSuiteDetailDto } from "./dto/TestSuiteDetailDto";
import { Order } from "../../common/enums/order";

const mockTestCaseResultService = () => ({
  createTestCaseResult: jest.fn(),
  editTestCaseResult: jest.fn(),
  findOne: jest.fn(),
});

const mockTestCaseService = () => ({
  findOne: jest.fn(),
  createTestCase: jest.fn(),
});

const mockProjectReadService = () => ({
  findOne: jest.fn(),
});

const mockTestSuiteService = () => ({
  createTestSuite: jest.fn(),
  getTestSuites: jest.fn(),
  getTestSuite: jest.fn(),
  getTestResults: jest.fn(),
  findOne: jest.fn(),
  deleteTestSuite: jest.fn(),
  editTestSuite: jest.fn(),
  getTestSuiteDetail: jest.fn(),
  createTestSuiteReport: jest.fn(),
  editTestSuiteReport: jest.fn(),
  getTodoList: jest.fn(),
  searchTestSuites: jest.fn(),
  createFilteredTestSuite: jest.fn(),
  assignUserTestSuite: jest.fn(),
  milestoneInTestSuite: jest.fn(),
  getActivityTestSuites: jest.fn(),
  addTestCasesToAssignedUsers: jest.fn(),
});

const mockTestSuitePageOptionDto = new TestSuitePageOptionsDto();

const mockTestCaseResultPageOptionsDto = new TestCaseResultPageOptionsDto();

const mockTestSuite: any = {
  id: "c4e0d7d7-1869-4a4a-95a9-6947cab4634e",
  name: "test 1",
  description: "description",
  status: "COMPLETED",
  assignTo: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
  sectionIds: ["997af9ff-9156-4c26-9c29-d43cfbe6fff3"],
};

const mockUserAssignedTestCases: any = [
  {
    totalActiveCases: 10,
    totalCompletedCases: 10,
  },
  {
    totalActiveCases: 5,
    totalCompletedCases: 5,
  },
];

const mockProject: any = {
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Raj",
  description: "raj olk new",
};

const mockTestCaseResult: any = {
  status: "Passed",
  comment: "test should be passed",
};

const mockTestSuiteReport: any = {
  passed: 5,
  failed: 1,
  blocked: 1,
  retest: 2,
  untested: 1,
  total: 10,
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

const mockPageOptionsDto: any = {
  order: Order.ASC,
  page: 1,
  take: 10,
};

const mockOrganization: any = {
  id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
  name: "keka",
};

const mockMilestone: any = {
  id: "4509d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Milestone 1",
  status: "START",
};

const mockTestSuiteList = [
  {
    id: "c4e0d7d7-1869-4a4a-95a9-6947cab4634e",
    name: "test 1",
    description: "description",
    status: "COMPLETED",
  },
  {
    id: "c4e0d7d7-1869-4a4a-95a9-6947cab4634e",
    name: "test 2",
    description: "description",
    status: "COMPLETED",
  },
];

const mockedTodoList: any = {
  users: [
    {
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
      totalActiveTestCases: 1,
      totalCompletedTestCases: 0,
    },
  ],
  testSuitesList: [
    {
      id: "c4e0d7d7-1869-4a4a-95a9-6947cab4634e",
      name: "test 1",
      description: "description",
      status: "COMPLETED",
    },
  ],
};

describe("TestCaseResultService", () => {
  let testCaseResultService: TestCaseResultService;
  let testSuiteService: TestSuiteService;
  let projectReadService: ProjectReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestCaseService,
        TestCaseResultService,
        TestSuiteService,
        ProjectReadService,
        {
          provide: TestCaseService,
          useFactory: mockTestCaseService,
        },
        {
          provide: TestCaseResultService,
          useFactory: mockTestCaseResultService,
        },
        {
          provide: TestSuiteService,
          useFactory: mockTestSuiteService,
        },
        {
          provide: ProjectReadService,
          useFactory: mockProjectReadService,
        },
      ],
    }).compile();

    projectReadService = module.get<ProjectReadService>(ProjectReadService);
    testSuiteService = module.get<TestSuiteService>(TestSuiteService);
    testCaseResultService = module.get<TestCaseResultService>(
      TestCaseResultService,
    );
  });

  /**
   * Find One Test Suite
   */
  describe("findOne", () => {
    it("should find one TestSuite", async () => {
      mocked(testSuiteService.findOne).mockImplementation(
        async () =>
          await Promise.resolve(mockTestSuite as unknown as TestSuiteEntity),
      );
      expect(await testSuiteService.findOne({})).toMatchObject(mockTestSuite);
    });
  });

  /**
   * Create test suite
   */

  describe("createTestSuite", () => {
    it("should return error if Project not found.", async () => {
      mocked(projectReadService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched.")),
      );
      expect(
        projectReadService.findOne({ id: mockProject.id }),
      ).rejects.toThrow("Project could not be fetched.");
    });
    it("should create a Test Suite", async () => {
      expect(mockTestSuite).toHaveProperty("name");
      expect(mockTestSuite).toHaveProperty("description");
      expect(mockTestSuite).toHaveProperty("assignTo");
      expect(mockTestSuite.assignTo).toEqual(mockedUser.id);

      mocked(testSuiteService.createTestSuite).mockImplementation(() =>
        Promise.resolve(mockTestSuite as unknown as TestSuiteEntity),
      );
      expect(
        await testSuiteService.createTestSuite(
          mockTestSuite,
          mockProject,
          mockedUser,
        ),
      ).toBe(mockTestSuite);
    });
    it("should return error if create test suite fails.", async () => {
      mocked(testSuiteService.createTestSuite).mockImplementation(() =>
        Promise.reject(new Error("Test suite fails.")),
      );
      expect(
        testSuiteService.createTestSuite(
          mockTestSuite,
          mockProject,
          mockedUser,
        ),
      ).rejects.toThrow("Test suite fails.");
    });
  });

  /**
   *get all test suite
   */

  describe("getTestSuites", () => {
    it("should return error if Project not found.", async () => {
      mocked(projectReadService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched.")),
      );
      expect(
        projectReadService.findOne({ id: mockProject.id }),
      ).rejects.toThrow("Project could not be fetched.");
    });
    it("should return all test Suites", async () => {
      mocked(testSuiteService.getTestSuites).mockImplementation(() =>
        Promise.resolve(mockTestSuite as TestSuitesPageDto),
      );
      expect(
        await testSuiteService.getTestSuites(
          mockTestSuitePageOptionDto,
          mockProject.id,
        ),
      ).toBe(mockTestSuite);
    });
    it("should return error if get test suite fails.", async () => {
      mocked(testSuiteService.getTestSuites).mockImplementation(() =>
        Promise.reject(new Error("get Test suite fails.")),
      );
      expect(
        testSuiteService.getTestSuites(
          mockTestSuitePageOptionDto,
          mockProject.id,
        ),
      ).rejects.toThrow("get Test suite fails.");
    });
  });

  /**
   *get all test result
   */

  describe("getTestResults", () => {
    it("should return error if test suite not found.", async () => {
      mocked(testSuiteService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Test suite could not be fetched.")),
      );
      expect(
        testSuiteService.findOne({ id: mockTestSuite.id }),
      ).rejects.toThrow("Test suite could not be fetched.");
    });
    it("should return all test suites result", async () => {
      mocked(testSuiteService.getTestResults).mockImplementation(() =>
        Promise.resolve(mockTestCaseResult as TestcasesResultsPageDto),
      );
      expect(
        await testSuiteService.getTestResults(
          mockTestCaseResultPageOptionsDto,
          mockTestSuite.id,
        ),
      ).toBe(mockTestCaseResult);
    });
    it("should return error if get test suite result fails.", async () => {
      mocked(testSuiteService.getTestResults).mockImplementation(() =>
        Promise.reject(new Error("get Test suite result fails.")),
      );
      expect(
        testSuiteService.getTestResults(
          mockTestCaseResultPageOptionsDto,
          mockTestSuite.id,
        ),
      ).rejects.toThrow("get Test suite result fails.");
    });
  });

  /**
   *submit test result
   */

  describe("editTestCaseResult", () => {
    it("should return error if test result not found.", async () => {
      mocked(testCaseResultService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Test result could not be fetched.")),
      );
      expect(
        testCaseResultService.findOne({ id: mockTestCaseResult.id }),
      ).rejects.toThrow("Test result could not be fetched.");
    });
    it("should submit test suites result", async () => {
      mocked(testCaseResultService.editTestCaseResult).mockImplementation(() =>
        Promise.resolve(mockTestCaseResult as unknown as TestCaseResultEntity),
      );
      expect(
        await testCaseResultService.editTestCaseResult(
          mockTestCaseResult,
          mockTestCaseResult.id,
          mockedUser,
        ),
      ).toBe(mockTestCaseResult);
    });
    it("should return error if get test result submit fails.", async () => {
      mocked(testCaseResultService.editTestCaseResult).mockImplementation(() =>
        Promise.reject(new Error("Test result submit fails.")),
      );
      expect(
        testCaseResultService.editTestCaseResult(
          mockTestCaseResult,
          mockTestCaseResult.id,
          mockedUser,
        ),
      ).rejects.toThrow("Test result submit fails.");
    });
  });

  describe("assignUserTestSuite", () => {
    it("should return true if user is assigned to the test suite", () => {
      mocked(testSuiteService.assignUserTestSuite).mockImplementation(
        async () => await Promise.resolve(true),
      );
      expect(
        testSuiteService.assignUserTestSuite(
          mockTestSuite,
          mockedUser.id,
          mockOrganization.id,
        ),
      ).resolves.toBe(true);
    });

    it("should return false if user is not assigned to the test suite", async () => {
      mocked(testSuiteService.assignUserTestSuite).mockImplementation(
        async () => await Promise.reject(false),
      );
      expect(
        testSuiteService.assignUserTestSuite(
          mockTestSuite,
          mockedUser.id,
          mockOrganization.id,
        ),
      ).rejects.toBe(false);
    });
  });

  describe("milestoneInTestSuite", () => {
    it("should return true if milestone found in testSuite", async () => {
      mocked(testSuiteService.milestoneInTestSuite).mockImplementation(
        async () => await Promise.resolve(true),
      );
      expect(
        testSuiteService.milestoneInTestSuite(mockTestSuite, mockMilestone.id),
      ).resolves.toBe(true);
    });

    it("should return false if milestone is not found in the test suite", async () => {
      mocked(testSuiteService.milestoneInTestSuite).mockImplementation(
        async () => await Promise.reject(false),
      );
      expect(
        testSuiteService.milestoneInTestSuite(mockTestSuite, mockedUser.id),
      ).rejects.toBe(false);
    });
  });

  describe("getActivityTestSuites", () => {
    it("should return test Suite List", async () => {
      mocked(testSuiteService.getActivityTestSuites).mockImplementation(
        async () => await Promise.resolve(mockTestSuiteList),
      );
      return await testSuiteService
        .getActivityTestSuites(mockPageOptionsDto, mockProject.id)
        .then((data) => {
          expect(data).toMatchObject(mockTestSuiteList);
        });
    });
  });

  describe("addTestCasesToAssignedUsers", () => {
    it("should return user assigned test cases", () => {
      mocked(testSuiteService.addTestCasesToAssignedUsers).mockImplementation(
        () => mockUserAssignedTestCases,
      );
      expect(
        testSuiteService.addTestCasesToAssignedUsers(mockTestSuite),
      ).toMatchObject(mockUserAssignedTestCases);
    });
  });

  describe("getTestSuite", () => {
    it("should get a test suite", () => {
      mocked(testSuiteService.getTestSuite).mockImplementation(
        async () => await Promise.resolve(mockTestSuite),
      );
      testSuiteService.getTestSuite(mockTestSuite.id).then((data) => {
        expect(data).toMatchObject(mockTestSuite);
      });
    });
  });

  /**
   * Edit a test suite
   */
  describe("editTestSuite", () => {
    it("should return error if test suite not found.", async () => {
      mocked(testSuiteService.editTestSuite).mockImplementation(() =>
        Promise.reject(new Error("Test suite not found")),
      );
      expect(mockTestSuite).toHaveProperty("id");
      expect(mockTestSuite).toHaveProperty("name");
      expect(mockTestSuite).toHaveProperty("description");
      expect(mockTestSuite).toHaveProperty("status");
      expect(mockTestSuite).toHaveProperty("assignTo");
      expect(mockTestSuite.assignTo).toEqual(mockedUser.id);

      expect(
        testSuiteService.editTestSuite(
          mockTestSuite,
          mockTestSuite.id,
          mockedUser,
        ),
      ).rejects.toThrow("Test suite not found");
    });

    it("should update the test suite name, description, status and assignedTo", async () => {
      mocked(testSuiteService.editTestSuite).mockImplementation(() =>
        Promise.resolve(mockTestSuite as TestSuiteEntity),
      );

      expect(mockTestSuite).toHaveProperty("id");
      expect(mockTestSuite).toHaveProperty("name");
      expect(mockTestSuite).toHaveProperty("description");
      expect(mockTestSuite).toHaveProperty("status");
      expect(mockTestSuite).toHaveProperty("assignTo");
      expect(mockTestSuite.assignTo).toEqual(mockedUser.id);

      expect(
        testSuiteService.editTestSuite(
          mockTestSuite,
          mockTestSuite.id,
          mockedUser,
        ),
      ).resolves.toBe(mockTestSuite);
    });
  });

  /**
   * Find single Test Suite
   */
  describe("getTestSuiteDetail", () => {
    it("should return error if test suite not found.", async () => {
      mocked(testSuiteService.getTestSuiteDetail).mockImplementation(() =>
        Promise.reject(new Error("Test suite not found")),
      );
      expect(mockTestSuite).toHaveProperty("id");

      expect(
        testSuiteService.getTestSuiteDetail(mockTestSuite.id),
      ).rejects.toThrow("Test suite not found");
    });

    it("should return the test suite", async () => {
      mocked(testSuiteService.getTestSuiteDetail).mockImplementation(() =>
        Promise.resolve(mockTestSuite as TestSuiteEntity),
      );
      expect(mockTestSuite).toHaveProperty("id");

      expect(
        testSuiteService.getTestSuiteDetail(mockTestSuite.id),
      ).resolves.toBe(mockTestSuite);
    });
  });

  /**
   * Create Test Suite Report
   */
  describe("createTestSuiteReport", () => {
    it("should return true after creating new test suite report", async () => {
      mocked(testSuiteService.createTestSuiteReport).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(mockTestSuiteReport).toHaveProperty("passed");
      expect(mockTestSuiteReport).toHaveProperty("failed");
      expect(mockTestSuiteReport).toHaveProperty("retest");
      expect(mockTestSuiteReport).toHaveProperty("blocked");
      expect(mockTestSuiteReport).toHaveProperty("untested");

      expect(
        testSuiteService.createTestSuiteReport(
          mockTestSuiteReport,
          mockTestSuite,
        ),
      ).resolves.toBeTruthy();
    });
  });

  /**
   * Edit Test Suite Report
   */
  describe("editTestSuiteReport", () => {
    it("should return error if test suite report not found", async () => {
      mocked(testSuiteService.editTestSuiteReport).mockImplementation(() =>
        Promise.reject(new Error("Test suite report not found")),
      );
      expect(mockTestSuite).toHaveProperty("id");

      expect(
        testSuiteService.editTestSuiteReport(mockTestSuite.id, mockedUser),
      ).rejects.toThrow("Test suite report not found");
    });

    it("should return true after updating test suite report", async () => {
      mocked(testSuiteService.editTestSuiteReport).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(mockTestSuite).toHaveProperty("id");

      expect(
        testSuiteService.editTestSuiteReport(mockTestSuite.id, mockedUser),
      ).resolves.toBeTruthy();
    });
  });

  /**
   *delete test suite
   */

  describe("deleteTestSuite", () => {
    it("should return error if Project not found.", async () => {
      mocked(projectReadService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched.")),
      );
      expect(
        projectReadService.findOne({ id: mockProject.id }),
      ).rejects.toThrow("Project could not be fetched.");
    });
    it("should delete a test suite", async () => {
      mocked(testSuiteService.deleteTestSuite).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(await testSuiteService.deleteTestSuite(mockTestSuite.id)).toBe(
        true,
      );
    });
    it("should return error if delete test suite fails.", async () => {
      mocked(testSuiteService.deleteTestSuite).mockImplementation(() =>
        Promise.reject(new Error("delete Test suite fails.")),
      );
      expect(testSuiteService.deleteTestSuite(mockProject.id)).rejects.toThrow(
        "delete Test suite fails.",
      );
    });
  });

  /**
   * Testing get Todo List for project
   */

  describe("getTodoList", () => {
    it("should return error if Project not found.", async () => {
      mocked(testSuiteService.getTodoList).mockImplementation(() =>
        Promise.reject(new Error("Project not found.")),
      );

      expect(testSuiteService.getTodoList(mockProject.id)).rejects.toThrow(
        "Project not found.",
      );
    });

    it("should return todo list of test runs", async () => {
      mocked(testSuiteService.getTodoList).mockImplementation(() =>
        Promise.resolve(mockedTodoList as TestSuiteTodoListDto),
      );

      expect(
        testSuiteService.getTodoList(mockProject.id),
      ).resolves.toStrictEqual(mockedTodoList);
    });
  });

  /**
   * Testing to get search results for test suites
   */
  describe("searchTestSuites", () => {
    it("should return test suite search result", async () => {
      const searchResult = mockTestSuite;

      mocked(testSuiteService.searchTestSuites).mockImplementation(() =>
        Promise.resolve(searchResult as TestSuiteDetailDto[]),
      );
      expect(
        testSuiteService.searchTestSuites(mockTestSuite.name, mockedUser),
      ).resolves.toEqual(searchResult);
    });
  });

  /**
   * Testing to Create test suite with filtered sections
   */
  describe("createFilteredTestSuite", () => {
    it("should return error if no test cases found for test suite", async () => {
      mocked(testSuiteService.createFilteredTestSuite).mockImplementation(() =>
        Promise.reject(new Error("No test cases found")),
      );
      expect(
        testSuiteService.createFilteredTestSuite(
          mockTestSuite,
          mockProject,
          mockedUser,
        ),
      ).rejects.toThrow("No test cases found");
    });

    it("should create a Test Suite", async () => {
      expect(mockTestSuite).toHaveProperty("name");
      expect(mockTestSuite).toHaveProperty("description");
      expect(mockTestSuite).toHaveProperty("assignTo");
      expect(mockTestSuite).toHaveProperty("sectionIds");

      mocked(testSuiteService.createFilteredTestSuite).mockImplementation(() =>
        Promise.resolve(mockTestSuite as unknown as TestSuiteEntity),
      );
      expect(
        await testSuiteService.createFilteredTestSuite(
          mockTestSuite,
          mockProject,
          mockedUser,
        ),
      ).toBe(mockTestSuite);
    });
  });
});
