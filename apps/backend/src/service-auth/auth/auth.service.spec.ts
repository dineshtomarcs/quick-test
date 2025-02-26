import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { UserEntity } from "../../service-users/user/user.entity";
import { AuthService } from "./auth.service";

const mockAuthService = () => ({
  validateUser: jest.fn(),
});

const mockCredantialsDto: any = {
  password: "password",
  email: "singhail@yopmail.com",
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

describe("UserService", () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe("validateUser", () => {
    it("return the username as validate is successful", async () => {
      // first check the function is called or not
      expect(authService.validateUser).not.toHaveBeenCalled();

      expect(mockCredantialsDto).toHaveProperty("email");
      expect(mockCredantialsDto).toHaveProperty("password");

      mocked(authService.validateUser).mockImplementation(() =>
        Promise.resolve(mockedUser as unknown as UserEntity),
      );

      const userData = await authService.validateUser(mockCredantialsDto);
      expect(userData).toBe(mockedUser);
    });
    it("should return error if user validation failed", async () => {
      mocked(authService.validateUser).mockImplementation(() =>
        Promise.reject(new Error("createUser fails")),
      );
      expect(authService.validateUser(mockCredantialsDto)).rejects.toThrow(
        "createUser fails",
      );
    });
  });
});
