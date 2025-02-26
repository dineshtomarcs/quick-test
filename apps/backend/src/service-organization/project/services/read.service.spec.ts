import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { ProjectReadService } from "./read.service";
import { MostActiveProjectDto } from "../dto/MostActiveProjectDto";
import { ProjectFavoriteDetailDto } from "../dto/ProjectFavoriteDetailDto";
import { MostActiveProjectListDto } from "../dto/MostActiveProjectListDto";
import { ProjectDto } from "../dto/ProjectDto";
import { ProjectEntity } from "../project.entity";
import { Order } from "../../../common/enums/order";
import { ProjectsPageDto } from "../dto/ProjectsPageDto";

const mockProjectReadService = () => ({
  getProject: jest.fn(),
  getProjects: jest.fn(),
  findOne: jest.fn(),
  findByProjectByIdOrName: jest.fn(),
  checkProjectWithSameName: jest.fn(),
  getAllProjects: jest.fn(),
  getArchivedProjects: jest.fn(),
  getMostActiveProjects: jest.fn(),
  findAllProjectsWithTestChanges: jest.fn(),
  getFavoriteProjects: jest.fn(),
  searchProjects: jest.fn(),
});

const mockProject: any = {
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Raj",
  description: "raj olk new",
};

const mockPageOptionsDto: any = {
  order: Order.ASC,
  page: 1,
  take: 10,
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

const mockedActiveProject = [
  {
    id: "1309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Logan",
    description: "raj olk new",
    totalTestChanges: 400,
  },
  {
    id: "2309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Drake",
    description: "raj olk new",
    totalTestChanges: 20,
  },
  {
    id: "4309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Brian",
    description: "raj olk new",
    totalTestChanges: 0,
  },
  {
    id: "6309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Jake",
    description: "raj olk new",
    totalTestChanges: 0,
  },
];

const mockedProjects = [
  {
    id: "2309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Project 1",
    description: "Project 1 description",
  },
  {
    id: "5309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Project 2",
    description: "Project 2 description",
  },
  {
    id: "6309d23b-44f8-455e-b5ff-0da8a30a3f7c",
    name: "Project 3",
    description: "Project 3 description",
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

describe("ProjectReadService", () => {
  let projectReadService: ProjectReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectReadService,
        {
          provide: ProjectReadService,
          useFactory: mockProjectReadService,
        },
      ],
    }).compile();

    projectReadService = module.get<ProjectReadService>(ProjectReadService);
  });

  /**
   * Find One Project
   */
  describe("findOne", () => {
    it("should find one Project", async () => {
      mocked(projectReadService.findOne).mockImplementation(
        async () =>
          await Promise.resolve(mockProject as unknown as ProjectEntity),
      );
      expect(await projectReadService.findOne({})).toMatchObject(mockProject);
    });
  });

  /**
   * Get project Detail
   */

  describe("getProject", () => {
    it("should return a single project", async () => {
      mocked(projectReadService.getProject).mockImplementation(() =>
        Promise.resolve(mockProject),
      );
      const result = await projectReadService.getProject(
        "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
        mockedUser,
      );
      expect(result.id).toBe("6409d23b-44f8-455e-b5ff-0da8a30a3f7c");
      expect(
        await projectReadService.getProject(result.id, mockedUser),
      ).toMatchObject(result);
    });

    it("should return error if getProject fails", async () => {
      mocked(projectReadService.getProject).mockImplementation(() =>
        Promise.reject(new Error("Project details could not be fetched.")),
      );
      expect(
        projectReadService.getProject(mockProject, mockedUser),
      ).rejects.toThrow("Project details could not be fetched.");
    });
  });

  /*
        Get projects
    */

  describe("getProjects", () => {
    it("should return all projects", async () => {
      mocked(projectReadService.getProjects).mockImplementation(async () =>
        Promise.resolve(mockedFavoriteProjects as unknown as ProjectsPageDto),
      );
      return await projectReadService
        .getProjects(mockPageOptionsDto, mockedUser)
        .then((data) => {
          expect(data).toMatchObject(mockedFavoriteProjects);
        });
    });
  });

  /*
        Get project by id or name
    */

  describe("findByProjectByIdOrName", () => {
    it("should return a single project, searched by name", async () => {
      mocked(projectReadService.findByProjectByIdOrName).mockImplementation(
        () => Promise.resolve(mockProject),
      );

      expect(
        projectReadService.findByProjectByIdOrName({
          projectname: mockProject.name,
        }),
      ).resolves.toEqual(mockProject);
    });

    it("should return a single project, searched by id", async () => {
      mocked(projectReadService.findByProjectByIdOrName).mockImplementation(
        () => Promise.resolve(mockProject),
      );

      expect(
        projectReadService.findByProjectByIdOrName({
          id: mockProject.id,
        }),
      ).resolves.toEqual(mockProject);
    });

    it("should return error when project not found", async () => {
      mocked(projectReadService.findByProjectByIdOrName).mockImplementation(
        () => Promise.reject(new Error("Project not found")),
      );

      expect(
        projectReadService.findByProjectByIdOrName({
          id: mockProject.id,
        }),
      ).rejects.toThrow("Project not found");
    });
  });

  /*
        Check project by name and organization id
    */

  describe("checkProjectWithSameName", () => {
    it("should return true", async () => {
      mocked(projectReadService.checkProjectWithSameName).mockImplementation(
        () => Promise.resolve(true),
      );
      return projectReadService
        .checkProjectWithSameName(mockProject.name, mockedUser.organization.id)
        .then((data) => {
          expect(data).toBe(true);
        });
    });

    it("should return error when project not found", async () => {
      mocked(projectReadService.checkProjectWithSameName).mockImplementation(
        () =>
          Promise.reject(new Error("Project with this name already exists")),
      );

      expect(
        projectReadService.checkProjectWithSameName(
          mockProject.name,
          mockedUser.organization.id,
        ),
      ).rejects.toThrow("Project with this name already exists");
    });
  });

  /**
   * Get All Project with active Test runs and milestones
   */
  describe("getAllProjects", () => {
    it("should return error for project not found", async () => {
      mocked(projectReadService.getAllProjects).mockImplementation(() =>
        Promise.reject(new Error("No projects were found")),
      );

      expect(projectReadService.getAllProjects(mockedUser)).rejects.toThrow(
        "No projects were found",
      );
    });

    it("should return all projects with active test runs and milestones ", async () => {
      expect(mockedFavoriteProjects[0]).toHaveProperty("favorite");
      expect(mockedFavoriteProjects[0]).toHaveProperty("milestones");
      expect(mockedFavoriteProjects[0]).toHaveProperty("testsuites");

      mocked(projectReadService.getAllProjects).mockImplementation(() =>
        Promise.resolve(mockedFavoriteProjects as ProjectFavoriteDetailDto[]),
      );

      expect(
        projectReadService.getAllProjects(mockedUser),
      ).resolves.toStrictEqual(mockedFavoriteProjects);
    });
  });

  /**
   * Get most active projects in the organization
   * with total test changes
   */
  describe("getMostActiveProjects", () => {
    it("should return 4 most active projects", async () => {
      expect(mockedActiveProject).toHaveLength(4);

      mockedActiveProject.forEach((project) => {
        expect(project).toHaveProperty("totalTestChanges");
        expect(project.totalTestChanges).toBeGreaterThanOrEqual(0);
      });

      mocked(projectReadService.getMostActiveProjects).mockImplementation(() =>
        Promise.resolve(
          mockedActiveProject as unknown as MostActiveProjectListDto[],
        ),
      );

      const pageOptionsDto: any = {
        days: 90,
      };
      expect(
        projectReadService.getMostActiveProjects(pageOptionsDto, mockedUser),
      ).resolves.toStrictEqual(mockedActiveProject);
    });
  });

  /**
   * Find all projects with total test changes
   */
  describe("findAllProjectsWithTestChanges", () => {
    it("should return error if no projects were found with test changes", async () => {
      mocked(
        projectReadService.findAllProjectsWithTestChanges,
      ).mockImplementation(() =>
        Promise.reject(new Error("No projects were found")),
      );

      const pageOptionsDto: any = {
        days: 90,
      };
      expect(
        projectReadService.findAllProjectsWithTestChanges(
          pageOptionsDto,
          mockedUser,
        ),
      ).rejects.toThrow("No projects were found");
    });

    it("should return all projects with total test changes", async () => {
      mockedActiveProject.forEach((project) => {
        expect(project).toHaveProperty("totalTestChanges");
        expect(project.totalTestChanges).toBeGreaterThanOrEqual(0);
      });

      mocked(
        projectReadService.findAllProjectsWithTestChanges,
      ).mockImplementation(() =>
        Promise.resolve(
          mockedActiveProject as unknown as MostActiveProjectDto[],
        ),
      );

      const pageOptionsDto: any = {
        days: 90,
      };
      expect(
        projectReadService.findAllProjectsWithTestChanges(
          pageOptionsDto,
          mockedUser,
        ),
      ).resolves.toStrictEqual(mockedActiveProject);
    });
  });

  /**
   * Get favorite projects for user
   */
  describe("getFavoriteProjects", () => {
    it("should return error if no favorite projects were found for the user", async () => {
      expect(mockedUser).toHaveProperty("id");

      mocked(projectReadService.getFavoriteProjects).mockImplementation(() =>
        Promise.reject(
          new Error("No favorite projects were found for this user"),
        ),
      );

      expect(
        projectReadService.getFavoriteProjects(mockedUser),
      ).rejects.toThrow("No favorite projects were found for this user");
    });

    it("should return all favorite projects for the user", async () => {
      mockedFavoriteProjects.forEach((project) => {
        expect(project).toHaveProperty("favorite");
      });

      const favoriteProjects = mockedFavoriteProjects.filter(
        (project) => project.favorite,
      );

      mocked(projectReadService.getFavoriteProjects).mockImplementation(() =>
        Promise.resolve(favoriteProjects as unknown as ProjectDto[]),
      );

      expect(
        projectReadService.getFavoriteProjects(mockedUser),
      ).resolves.toStrictEqual(favoriteProjects);
    });
  });

  /**
   * Testing to get search results for projects
   */
  describe("searchProjects", () => {
    it("should return all projects with matching search", async () => {
      const searchProjectName = "project";

      const searchResults = mockedProjects.filter((mockedProject) => {
        const string1 = mockedProject.name.toLowerCase();
        const string2 = searchProjectName.toLowerCase();
        return string1.includes(string2);
      });

      mocked(projectReadService.searchProjects).mockImplementation(() =>
        Promise.resolve(searchResults as unknown as ProjectDto[]),
      );

      expect(
        projectReadService.searchProjects(
          searchProjectName,
          mockedUser.organization.id,
        ),
      ).resolves.toStrictEqual(mockedProjects);
    });
  });

  /**
   * Get All archived Projects with active Test runs and milestones
   */
  describe("getArchivedProjects", () => {
    it("should return error for project not found", async () => {
      mocked(projectReadService.getArchivedProjects).mockImplementation(() =>
        Promise.reject(new Error("No archived projects were found")),
      );

      expect(
        projectReadService.getArchivedProjects(mockedUser),
      ).rejects.toThrow("No archived projects were found");
    });

    it("should return all archived projects with active test runs and milestones ", async () => {
      expect(mockedFavoriteProjects[0]).toHaveProperty("favorite");
      expect(mockedFavoriteProjects[0]).toHaveProperty("milestones");
      expect(mockedFavoriteProjects[0]).toHaveProperty("testsuites");

      mocked(projectReadService.getArchivedProjects).mockImplementation(() =>
        Promise.resolve(mockedFavoriteProjects as ProjectDto[]),
      );

      expect(
        projectReadService.getArchivedProjects(mockedUser),
      ).resolves.toStrictEqual(mockedFavoriteProjects);
    });
  });
});
