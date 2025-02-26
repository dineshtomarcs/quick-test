import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { ProjectCreateService } from "./create.service";
import { ProjectDetailsDto } from "../dto/ProjectDetailsDto";

const mockProjectCreateService = () => ({
  createProject: jest.fn(),
  createTestCase: jest.fn(),
});

const mockProject: any = {
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Raj",
  description: "raj olk new",
};

const mockTestCaseDto: any = {
  title: "mockTest",
  preconditions: "preconditionTest",
  steps: "stepsTest",
  expectedResults: "expectedResults Test",
  executionPriority: "executionPriorityTest",
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

describe("ProjectCreateService", () => {
  let projectCreateService: ProjectCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectCreateService,
        {
          provide: ProjectCreateService,
          useFactory: mockProjectCreateService,
        },
      ],
    }).compile();

    projectCreateService =
      module.get<ProjectCreateService>(ProjectCreateService);
  });

  /**
   * Create Project
   */

  describe("create", () => {
    it("should create a Project", async () => {
      expect(mockProject).toHaveProperty("name");
      expect(mockProject).toHaveProperty("description");

      mocked(projectCreateService.createProject).mockImplementation(() =>
        Promise.resolve(mockProject as unknown as ProjectDetailsDto),
      );
      expect(
        await projectCreateService.createProject(mockProject, mockedUser),
      ).toBe(mockProject);
    });

    it("should return error if createProject fails", async () => {
      mocked(projectCreateService.createProject).mockImplementation(() =>
        Promise.reject(new Error("createProject Fails")),
      );
      expect(
        projectCreateService.createProject(mockProject, mockedUser),
      ).rejects.toThrow("createProject Fails");
    });
  });

  describe("createTestCase", () => {
    it("it should create a TestCase", () => {
      const sectionId = "abc-fer";
      mocked(projectCreateService.createTestCase).mockImplementation(() =>
        Promise.resolve(mockTestCaseDto),
      );
      expect(
        projectCreateService
          .createTestCase(
            mockTestCaseDto,
            mockProject.id,
            sectionId,
            mockedUser,
          )
          .then((data) => {
            expect(data).toMatchObject(mockTestCaseDto);
          }),
      );
    });
  });
});
