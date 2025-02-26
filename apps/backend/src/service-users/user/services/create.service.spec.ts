import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { UserEntity } from "../user.entity";
import { OrganizationEntity } from "../../../service-organization/organization/organization.entity";
import { UserCreateService } from "./create.service";

const mockUserCreateService = () => ({
  createUser: jest.fn(),
  createOrganization: jest.fn(),
  createFavoriteProject: jest.fn(),
});

const mockCredantialsDto: any = {
  user: {
    firstName: "test",
    password: "password",
    email: "singhail@yopmail.com",
  },
  organization: "Crownstack",
};

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

const mocklang: any = "myLang";

describe("UserCreateService", () => {
  let userCreateService: UserCreateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserCreateService,
        {
          provide: UserCreateService,
          useFactory: mockUserCreateService,
        },
      ],
    }).compile();

    userCreateService = module.get<UserCreateService>(UserCreateService);
  });

  /**
   * Create User Testing Cases
   */

  describe("create", () => {
    it("should create a user", async () => {
      // first check the function is called or not
      expect(userCreateService.createUser).not.toHaveBeenCalled();

      expect(mockCredantialsDto).toHaveProperty("organization");
      expect(mockCredantialsDto).toHaveProperty("user.firstName");
      expect(mockCredantialsDto).toHaveProperty("user.email");
      expect(mockCredantialsDto).toHaveProperty("user.password");

      mocked(userCreateService.createUser).mockImplementation(() =>
        Promise.resolve(mockedUser as unknown as UserEntity),
      );
      mocked(userCreateService.createOrganization).mockImplementation(() =>
        Promise.resolve(mockedUser as unknown as OrganizationEntity),
      );

      const organizationData = await userCreateService.createOrganization(
        mockCredantialsDto.organization,
      );
      expect(organizationData).toBe(mockedUser);

      const userData = await userCreateService.createUser(
        mockCredantialsDto.user,
        mockCredantialsDto.organization,
        mocklang,
      );
      expect(userData).toBe(mockedUser);
    });

    it("should return error if createUser fails", async () => {
      mocked(userCreateService.createUser).mockImplementation(() =>
        Promise.reject(new Error("createUser fails")),
      );
      expect(
        userCreateService.createUser(
          mockCredantialsDto.user,
          mockCredantialsDto.organization,
          mocklang,
        ),
      ).rejects.toThrow("createUser fails");
    });
  });

  /**
   * Testing method to create favorite project for user
   */
  describe("createFavoriteProject", () => {
    it("should return error for project not found", async () => {
      mocked(userCreateService.createFavoriteProject).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      const randomProjectId = "11111111-9156-4c26-9c29-d43cfbe6fff3";
      expect(
        userCreateService.createFavoriteProject(randomProjectId, mockedUser),
      ).rejects.toThrow("Project not found");
    });

    it("should return error duplicate favorite project", async () => {
      expect(mockedFavoriteProject[0]).toHaveProperty("id");

      mocked(userCreateService.createFavoriteProject).mockImplementation(() =>
        Promise.reject(
          new Error("User already has this project in favorite projects list"),
        ),
      );
      expect(
        userCreateService.createFavoriteProject(
          mockedFavoriteProject[0].id,
          mockedUser,
        ),
      ).rejects.toThrow(
        "User already has this project in favorite projects list",
      );
    });

    it("should return true after adding favorite project", async () => {
      expect(mockedFavoriteProject[0]).toHaveProperty("id");

      mocked(userCreateService.createFavoriteProject).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(
        userCreateService.createFavoriteProject(
          mockedFavoriteProject[0].id,
          mockedUser,
        ),
      ).resolves.toBeTruthy();
    });
  });
});
