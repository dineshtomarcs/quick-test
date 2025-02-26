import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { ProjectEntity } from "../../../service-organization/project/project.entity";
import { UserReadService } from "./read.service";

const mockUserReadService = () => ({
  getFavoriteProjects: jest.fn(),
});

const mockedUser: any = {
  id: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
  firstName: "test1",
  lastName: "lname",
  role: "USER",
  email: "singhail2@yopmail.com",
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
    name: "Crownstack",
  },
  profileImage: null,
  phone: null,
};

const mockedFavoriteProject = [
  {
    id: "99999999-9156-4c26-9c29-d43cfbe6fff3",
    name: "Project 1",
  },
  {
    id: "10000002-9156-4c26-9c29-d43cfbe6fff3",
    name: "Project 2",
  },
];

describe("UserReadService", () => {
  let userReadService: UserReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserReadService,
        {
          provide: UserReadService,
          useFactory: mockUserReadService,
        },
      ],
    }).compile();

    userReadService = module.get<UserReadService>(UserReadService);
  });

  /**
   * Testing method to get favorites projects of users
   */
  describe("getFavoriteProjects", () => {
    it("should return true after deleting favorite project", async () => {
      const mockedProjectIds = mockedFavoriteProject.map(
        (project) => project.id,
      );

      mocked(userReadService.getFavoriteProjects).mockImplementation(() =>
        Promise.resolve(mockedFavoriteProject as ProjectEntity[]),
      );
      expect(
        userReadService.getFavoriteProjects(mockedProjectIds, mockedUser),
      ).resolves.toBe(mockedFavoriteProject);
    });
  });
});
