import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { TestCaseService } from "./test-case.service";
import { TestCaseEntity } from "./test-case.entity";
import { ProjectReadService } from "../project/services/read.service";
import { TestCaseDto } from "./dto/TestCaseDto";
import { TestCaseDetailsDto } from "./dto/TestCaseDetailsDto";

const mockTestCaseService = () => ({
  getTestCase: jest.fn(),
  getTestCases: jest.fn(),
  findByTestCaseByIdOrName: jest.fn(),
  createTestCase: jest.fn(),
  editTestCase: jest.fn(),
  deleteTestCase: jest.fn(),
  findOne: jest.fn(),
  reOrderPriorities: jest.fn(),
  searchTestCases: jest.fn(),
});

const mockProjectReadService = () => ({
  findOne: jest.fn(),
});

const mockTestCase: any = {
  id: "c4e0d7d7-1869-4a4a-95a9-6947cab1984e",
  title: "Test 2case for test 2 lmao1",
  expectedResults: "Test Case for test expected result",
  steps: "lmao test",
  preconditions: "preconditions test",
  priority: 4,
};

const mockSection: any = {
  id: "d450d7d7-1869-4a4a-95a9-6947cab1984e",
  name: "Login",
  description: "Login related test cases",
};

const mockProject: any = {
  id: "c4e0d7d7-1869-4a4a-95a9-3421wsg2453r",
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

describe("TestCaseService", () => {
  let testCaseService: TestCaseService;
  let projectReadService: ProjectReadService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestCaseService,
        ProjectReadService,
        {
          provide: TestCaseService,
          useFactory: mockTestCaseService,
        },
        {
          provide: ProjectReadService,
          useFactory: mockProjectReadService,
        },
      ],
    }).compile();

    testCaseService = module.get<TestCaseService>(TestCaseService);
    projectReadService = module.get<ProjectReadService>(ProjectReadService);
  });

  /**
   * Find One Test
   */

  describe("findOne", () => {
    it("should find one Test-case", async () => {
      mocked(testCaseService.findOne).mockImplementation(
        async () =>
          await Promise.resolve(mockTestCase as unknown as TestCaseEntity),
      );
      expect(await testCaseService.findOne({})).toMatchObject(mockTestCase);
    });
  });

  /**
   * Create test case
   */

  describe("create", () => {
    it("should return error if project not found.", async () => {
      mocked(projectReadService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched.")),
      );
      expect(
        projectReadService.findOne({ id: mockProject.id }),
      ).rejects.toThrow("Project could not be fetched.");
    });
    it("should create a TestCase", async () => {
      expect(mockTestCase).toHaveProperty("title");
      expect(mockTestCase).toHaveProperty("expectedResults");
      expect(mockTestCase).toHaveProperty("steps");
      expect(mockTestCase).toHaveProperty("preconditions");

      mocked(testCaseService.createTestCase).mockImplementation(() =>
        Promise.resolve(mockTestCase as unknown as TestCaseEntity),
      );
      expect(
        await testCaseService.createTestCase(
          mockTestCase,
          mockProject,
          mockSection.id,
          mockedUser,
          mockProject.id,
        ),
      ).toBe(mockTestCase);
    });
    it("should return error if create TestCase fails.", async () => {
      mocked(testCaseService.createTestCase).mockImplementation(() =>
        Promise.reject(new Error("create TestCase Fails.")),
      );
      expect(
        testCaseService.createTestCase(
          mockTestCase,
          mockProject,
          mockSection.id,
          mockedUser,
          mockProject.id,
        ),
      ).rejects.toThrow("create TestCase Fails.");
    });
  });

  /*
        Get test by id or name
    */

  describe("findBytestByIdOrName", () => {
    it("should return a single test, searched by name", async () => {
      mocked(testCaseService.findByTestCaseByIdOrName).mockImplementation(
        async () =>
          await Promise.resolve(mockTestCase as unknown as TestCaseEntity),
      );

      await expect(
        testCaseService.findByTestCaseByIdOrName({
          testCaseTitle: mockTestCase.name,
        }),
      ).resolves.toMatchObject(mockTestCase);
    });

    it("should return a single test-case, searched by id", async () => {
      mocked(testCaseService.findByTestCaseByIdOrName).mockImplementation(
        async () => await Promise.resolve(mockTestCase),
      );

      await expect(
        testCaseService.findByTestCaseByIdOrName({
          id: mockTestCase.id,
        }),
      ).resolves.toMatchObject(mockTestCase);
    });
  });

  /**
   * Edit test case
   */

  describe("edit", () => {
    it("should return error if test case not found.", async () => {
      mocked(testCaseService.findOne).mockImplementation(() =>
        Promise.reject(new Error("TestCase details could not be fetched.")),
      );
      expect(testCaseService.findOne({ id: mockTestCase.id })).rejects.toThrow(
        "TestCase details could not be fetched.",
      );
    });
    it("should edit a TestCase.", async () => {
      expect(mockTestCase).toHaveProperty("id");

      mocked(testCaseService.editTestCase).mockImplementation(() =>
        Promise.resolve(mockTestCase as unknown as TestCaseDto),
      );
      expect(
        await testCaseService.editTestCase(
          mockTestCase,
          mockTestCase.id,
          mockProject,
          mockSection.id,
          mockedUser,
        ),
      ).toBe(mockTestCase);
    });
    it("should return error if edit TestCase fails.", async () => {
      mocked(testCaseService.editTestCase).mockImplementation(() =>
        Promise.reject(new Error("edit TestCase Fails.")),
      );
      expect(
        testCaseService.editTestCase(
          mockTestCase,
          mockTestCase.id,
          mockProject,
          mockSection.id,
          mockedUser,
        ),
      ).rejects.toThrow("edit TestCase Fails.");
    });
  });

  /**
   * Get test case
   */

  describe("getTestCase", () => {
    it("should return a single TestCase.", async () => {
      expect(mockTestCase).toHaveProperty("id");

      mocked(testCaseService.getTestCase).mockImplementation(() =>
        Promise.resolve(mockTestCase),
      );
      const result = await testCaseService.getTestCase(mockTestCase.id);

      expect(result.id).toBe(mockTestCase.id);
    });

    it("should return error if TestCase details could not be fetched.", async () => {
      mocked(testCaseService.getTestCase).mockImplementation(() =>
        Promise.reject(new Error("TestCase details could not be fetched.")),
      );
      expect(testCaseService.getTestCase(mockTestCase.id)).rejects.toThrow(
        "TestCase details could not be fetched.",
      );
    });
  });

  /**
   * re-order test case priorities
   */
  describe("reOrderPriorities", () => {
    it("should return error if testcase and section does not match", async () => {
      mocked(testCaseService.reOrderPriorities).mockImplementation(() =>
        Promise.reject(new Error("Section & TestCase mismatch. Try again.")),
      );
      expect(mockTestCase).toHaveProperty("id");
      expect(mockTestCase).toHaveProperty("priority");
      expect(mockSection).toHaveProperty("id");
      expect(
        testCaseService.reOrderPriorities(mockTestCase.id, mockSection.id, 5),
      ).rejects.toThrow("Section & TestCase mismatch. Try again.");
    });

    it("should return error if new priority is greater than highest priority", async () => {
      mocked(testCaseService.reOrderPriorities).mockImplementation(() =>
        Promise.reject(new Error("Invalid position supplied. Try again.")),
      );
      expect(mockTestCase).toHaveProperty("id");
      expect(mockTestCase).toHaveProperty("priority");
      expect(mockSection).toHaveProperty("id");
      expect(
        testCaseService.reOrderPriorities(mockTestCase.id, mockSection.id, 5),
      ).rejects.toThrow("Invalid position supplied. Try again.");
    });

    it("should update the priority of the testCases", async () => {
      mocked(testCaseService.reOrderPriorities).mockImplementation(() =>
        Promise.resolve(mockTestCase as unknown as TestCaseEntity[]),
      );
      expect(mockTestCase).toHaveProperty("id");
      expect(mockTestCase).toHaveProperty("priority");
      expect(mockSection).toHaveProperty("id");
      expect(
        testCaseService.reOrderPriorities(mockTestCase.id, mockSection.id, 3),
      ).resolves.toBe(mockTestCase);
    });
  });

  /**
   * delete test case
   */
  describe("deleteTestCase", () => {
    it("should delete a TestCase.", async () => {
      expect(mockTestCase).toHaveProperty("id");

      mocked(testCaseService.deleteTestCase).mockImplementation(() =>
        Promise.resolve(true),
      );
      const result = await testCaseService.deleteTestCase(mockTestCase.id);

      expect(result).toBe(true);
    });

    it("should return error if TestCase could not be deleted.", async () => {
      mocked(testCaseService.deleteTestCase).mockImplementation(() =>
        Promise.reject(new Error("TestCase could not be deleted.")),
      );
      expect(testCaseService.deleteTestCase(mockTestCase.id)).rejects.toThrow(
        "TestCase could not be deleted.",
      );
    });
  });

  /**
   * Testing to get search results for test cases
   */
  describe("searchTestCases", () => {
    it("should return empty array if not title and id provided", async () => {
      const searchResult = [];

      mocked(testCaseService.searchTestCases).mockImplementation(() =>
        Promise.resolve(searchResult),
      );
      expect(
        testCaseService.searchTestCases(null, null, mockedUser),
      ).resolves.toHaveLength(0);
    });

    it("should return test case search result", async () => {
      const searchResult = mockTestCase;

      mocked(testCaseService.searchTestCases).mockImplementation(() =>
        Promise.resolve(searchResult as TestCaseDetailsDto[]),
      );
      expect(
        testCaseService.searchTestCases(mockTestCase.title, null, mockedUser),
      ).resolves.toEqual(mockTestCase);
    });
  });
});
