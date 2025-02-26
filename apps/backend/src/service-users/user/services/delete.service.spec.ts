import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { UserDeleteService } from "./delete.service";

const mockUserDeleteService = () => ({
  deleteFavoriteProject: jest.fn(),
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

describe("UserDeleteService", () => {
  let userDeleteService: UserDeleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserDeleteService,
        {
          provide: UserDeleteService,
          useFactory: mockUserDeleteService,
        },
      ],
    }).compile();

    userDeleteService = module.get<UserDeleteService>(UserDeleteService);
  });

  /**
   * Testing method to delete favorite project for user
   */
  describe("deleteFavoriteProject", () => {
    it("should return error for project not found", async () => {
      mocked(userDeleteService.deleteFavoriteProject).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      const randomProjectId = "11111111-9156-4c26-9c29-d43cfbe6fff3";
      expect(
        userDeleteService.deleteFavoriteProject(randomProjectId, mockedUser),
      ).rejects.toThrow("Project not found");
    });

    it("should return error duplicate favorite project", async () => {
      expect(mockedFavoriteProject[0]).toHaveProperty("id");

      mocked(userDeleteService.deleteFavoriteProject).mockImplementation(() =>
        Promise.reject(
          new Error("Project not found in user's favorite projects list"),
        ),
      );
      expect(
        userDeleteService.deleteFavoriteProject(
          mockedFavoriteProject[0].id,
          mockedUser,
        ),
      ).rejects.toThrow("Project not found in user's favorite projects list");
    });

    it("should return true after deleting favorite project", async () => {
      expect(mockedFavoriteProject[0]).toHaveProperty("id");

      mocked(userDeleteService.deleteFavoriteProject).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(
        userDeleteService.deleteFavoriteProject(
          mockedFavoriteProject[0].id,
          mockedUser,
        ),
      ).resolves.toBeTruthy();
    });
  });
});
