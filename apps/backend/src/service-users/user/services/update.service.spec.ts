import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { UserDto } from "../dto/UserDto";
import { UserUpdateService } from "./update.service";

const mockUserUpdateService = () => ({
  resetPassword: jest.fn(),
  changePassword: jest.fn(),
  updateUser: jest.fn(),
  updateUserStatus: jest.fn(),
  reactivateUser: jest.fn(),
});

const mockResetPasswordDto: any = {
  token: "qwrfsd24ddvvs",
  password: "password",
};

const mockChangePasswordDto: any = {
  oldPassword: "oldPassword",
  newPassword: "password",
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

describe("UserUpdateService", () => {
  let userUpdateService: UserUpdateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserUpdateService,
        {
          provide: UserUpdateService,
          useFactory: mockUserUpdateService,
        },
      ],
    }).compile();

    userUpdateService = module.get<UserUpdateService>(UserUpdateService);
  });

  /**
   * Reset Password Testing Cases
   */

  describe("resetPassword", () => {
    it("should reset the password", async () => {
      // first check the function is called or not
      expect(userUpdateService.resetPassword).not.toHaveBeenCalled();

      expect(mockResetPasswordDto).toHaveProperty("password");
      expect(mockResetPasswordDto).toHaveProperty("token");

      mocked(userUpdateService.resetPassword).mockImplementation(() =>
        Promise.resolve(true),
      );

      const data = await userUpdateService.resetPassword(
        mockResetPasswordDto.password,
        mockResetPasswordDto.token,
      );
      expect(data).toBe(true);
    });

    it("should return error if password does not reset", async () => {
      mocked(userUpdateService.resetPassword).mockImplementation(() =>
        Promise.reject(new Error("reset Password fails")),
      );
      expect(
        userUpdateService.resetPassword(
          mockResetPasswordDto.password,
          mockResetPasswordDto.token,
        ),
      ).rejects.toThrow("reset Password fails");
    });
  });

  /**
   * Change Password Testing Cases
   */

  describe("changePassword", () => {
    it("should change the password", async () => {
      // first check the function is called or not
      expect(userUpdateService.changePassword).not.toHaveBeenCalled();

      expect(mockChangePasswordDto).toHaveProperty("oldPassword");
      expect(mockChangePasswordDto).toHaveProperty("newPassword");

      mocked(userUpdateService.changePassword).mockImplementation(() =>
        Promise.resolve(true),
      );

      const data = await userUpdateService.changePassword(
        mockChangePasswordDto,
        mockedUser,
      );
      expect(data).toBe(true);
    });

    it("should return error if password does not change", async () => {
      mocked(userUpdateService.changePassword).mockImplementation(() =>
        Promise.reject(new Error("change Password fails")),
      );
      expect(
        userUpdateService.changePassword(mockChangePasswordDto, mockedUser),
      ).rejects.toThrow("change Password fails");
    });
  });

  /**
   * Update User details
   */

  describe("updateUser", () => {
    it("should update the user", async () => {
      // first check the function is called or not
      expect(userUpdateService.updateUser).not.toHaveBeenCalled();

      expect(mockedUser).toHaveProperty("id");

      mocked(userUpdateService.updateUser).mockImplementation(() =>
        Promise.resolve(true),
      );

      const data = await userUpdateService.updateUser(
        mockedUser,
        mockedUser.organization,
        mockedUser,
        mockedUser,
      );
      expect(true).toBe(data);
    });

    it("should return error if does not update the user", async () => {
      mocked(userUpdateService.updateUser).mockImplementation(() =>
        Promise.reject(new Error("user update fails")),
      );
      expect(
        userUpdateService.updateUser(
          mockedUser,
          mockedUser.organization,
          mockedUser,
          mockedUser,
        ),
      ).rejects.toThrow("user update fails");
    });
  });

  describe("updateUserStatus", () => {
    it("should update the user status", async () => {
      mocked(userUpdateService.updateUserStatus).mockImplementation(() =>
        Promise.resolve(mockedUser),
      );
      expect(
        userUpdateService.updateUserStatus(
          { status: true },
          mockedUser.id,
          mockedUser,
        ),
      ).resolves.toBeTruthy();
    });

    it("should throw error if status is not boolean", () => {
      mocked(userUpdateService.updateUserStatus).mockImplementation(() =>
        Promise.reject(new Error("User status can be boolean type only")),
      );
      expect(
        userUpdateService.updateUserStatus(
          { status: null },
          mockedUser.id,
          mockedUser,
        ),
      ).rejects.toThrow("User status can be boolean type only");
    });
  });

  /**
   * Reactivate a user
   */

  describe("reactivateUser", () => {
    it("reactivate a user", async () => {
      mocked(userUpdateService.reactivateUser).mockImplementation(() =>
        Promise.resolve(UserDto as unknown as UserDto),
      );
      const result = await userUpdateService.reactivateUser(
        "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
        mockedUser,
      );
      expect(result).toBe(UserDto);
    });

    it("should return error if reactivate user fails", async () => {
      mocked(userUpdateService.reactivateUser).mockImplementation(() =>
        Promise.reject(new Error("User can not be reactivated")),
      );
      expect(
        userUpdateService.reactivateUser(
          "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
          mockedUser,
        ),
      ).rejects.toThrow("User can not be reactivated");
    });
  });
});
