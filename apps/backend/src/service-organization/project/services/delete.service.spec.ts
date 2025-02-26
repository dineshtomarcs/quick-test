import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { ProjectDto } from "../dto/ProjectDto";

import { ProjectDeleteService } from "./delete.service";

const mockProjectDeleteService = () => ({
  deleteProject: jest.fn(),
  archiveProject: jest.fn(),
});

const mockProject: any = {
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Raj",
  description: "raj olk new",
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

describe("ProjectDeleteService", () => {
  let projectDeleteService: ProjectDeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectDeleteService,
        {
          provide: ProjectDeleteService,
          useFactory: mockProjectDeleteService,
        },
      ],
    }).compile();

    projectDeleteService =
      module.get<ProjectDeleteService>(ProjectDeleteService);
  });

  /**
   * delete project
   */

  describe("deleteProject", () => {
    it("should delete a project", async () => {
      mocked(projectDeleteService.deleteProject).mockImplementation(() =>
        Promise.resolve(true),
      );
      const result = await projectDeleteService.deleteProject(
        "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
      );
      expect(result).toBe(true);
    });

    it("should return error if deleteProject fails", async () => {
      mocked(projectDeleteService.deleteProject).mockImplementation(() =>
        Promise.reject(new Error("Project could not be deleted.")),
      );
      expect(projectDeleteService.deleteProject(mockProject)).rejects.toThrow(
        "Project could not be deleted.",
      );
    });
  });

  /**
   * Archive project
   */

  describe("archiveProject", () => {
    it("should archive a project", async () => {
      mocked(projectDeleteService.archiveProject).mockImplementation(() =>
        Promise.resolve(ProjectDto as unknown as ProjectDto),
      );
      const result = await projectDeleteService.archiveProject(
        "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
        mockedUser,
      );
      expect(result).toBe(ProjectDto);
    });

    it("should return error if archiveProject fails", async () => {
      mocked(projectDeleteService.archiveProject).mockImplementation(() =>
        Promise.reject(new Error("Project could not be archived.")),
      );
      expect(
        projectDeleteService.archiveProject(mockProject, mockedUser),
      ).rejects.toThrow("Project could not be archived.");
    });
  });
});
