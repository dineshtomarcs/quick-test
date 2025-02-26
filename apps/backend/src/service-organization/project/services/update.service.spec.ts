import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { ProjectUpdateService } from "./update.service";
import { ProjectDetailsDto } from "../dto/ProjectDetailsDto";
import { ProjectFavoriteDetailDto } from "../dto/ProjectFavoriteDetailDto";

const mockProjectUpdateService = () => ({
  editProject: jest.fn(),
  markFavoriteProject: jest.fn(),
});

const mockProject: any = {
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Raj",
  description: "raj olk new",
};

const mockedFavoriteProjects: any = [
  {
    description: "raj olk new",
    favorite: false,
    id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
    milestones: [],
    name: "Raj",
    testsuites: [
      {
        id: "9009d23b-44f8-455e-b5ff-0da8a30a3f7c",
        name: "Test suite 1",
        status: "PENDING",
      },
      {
        id: "2009d23b-44f8-455e-b5ff-0da8a30a3f7c",
        name: "Test suite 2",
        status: "INPROGRESS",
      },
    ],
  },
  {
    description: "raj olk new",
    favorite: true,
    id: "2309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Logan",
    milestones: [
      {
        id: "4509d23b-44f8-455e-b5ff-0da8a30a3f7c",
        name: "Milestone 1",
        status: "START",
      },
      {
        id: "4909d23b-44f8-455e-b5ff-0da8a30a3f7c",
        name: "Milestone 2",
        status: "OPEN",
      },
    ],
    testsuites: [
      {
        id: "9009d23b-44f8-455e-b5ff-0da8a30a3f7c",
        name: "Test suite 3",
        status: "PENDING",
      },
    ],
  },
];

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

describe("ProjectUpdateService", () => {
  let projectUpdateService: ProjectUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectUpdateService,
        {
          provide: ProjectUpdateService,
          useFactory: mockProjectUpdateService,
        },
      ],
    }).compile();

    projectUpdateService =
      module.get<ProjectUpdateService>(ProjectUpdateService);
  });

  /*
        Edit project 
    */

  describe("editProject", () => {
    it("should edit a project", async () => {
      expect(mockProject).toHaveProperty("name");
      expect(mockProject).toHaveProperty("description");

      mocked(projectUpdateService.editProject).mockImplementation(() =>
        Promise.resolve(mockProject as unknown as ProjectDetailsDto),
      );

      expect(
        projectUpdateService.editProject(
          {
            name: mockProject.name,
            description: mockProject.description,
          },
          mockProject.id,
          mockedUser,
        ),
      ).resolves.toEqual(mockProject);
    });

    it("should return an error if project id is found in edit project", async () => {
      expect(mockProject).toHaveProperty("name");
      expect(mockProject).toHaveProperty("description");

      mocked(projectUpdateService.editProject).mockImplementation(() =>
        Promise.reject(new Error("Project with this id not found")),
      );

      expect(
        projectUpdateService.editProject(
          {
            name: mockProject.name,
            description: mockProject.description,
          },
          "7809d23b-44f8-455e-b5ff-0da8a30a3f7c",
          mockedUser,
        ),
      ).rejects.toThrow("Project with this id not found");
    });
  });

  /**
   * Mark which projects are favorite
   * for current logged in user
   */
  describe("markFavoriteProjects", () => {
    it("should return projects marked favorite/unfavorite", async () => {
      expect(mockedFavoriteProjects[0]).toHaveProperty("favorite");

      mocked(projectUpdateService.markFavoriteProject).mockImplementation(() =>
        Promise.resolve(mockedFavoriteProjects as ProjectFavoriteDetailDto[]),
      );

      expect(
        projectUpdateService.markFavoriteProject(
          mockedFavoriteProjects,
          mockedUser,
        ),
      ).resolves.toStrictEqual(mockedFavoriteProjects);
    });
  });
});
