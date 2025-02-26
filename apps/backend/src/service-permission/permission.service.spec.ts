import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { PermissionType } from "../common/enums/permission";
import { Permission } from "./permission.entity";
import { PermissionService } from "./permission.service";

const mockPermissionService = () => ({
  findAllPermissions: jest.fn(),
  findAllPermissionsByRoleId: jest.fn(),
});

const mockedPermission: any = {
  permissionName: "get:all_permissions",
  roleId: 3,
  type: PermissionType.WEB,
  id: 1,
  createdAt: "",
  updatedAt: "",
};

describe("PermissionService", () => {
  let permissionService: PermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionService,
        {
          provide: PermissionService,
          useFactory: mockPermissionService,
        },
      ],
    }).compile();

    permissionService = module.get<PermissionService>(PermissionService);
  });

  /*
     Get all permissions
    */

  describe("findAllPermissions", () => {
    it("should return all permissions", async () => {
      mocked(permissionService.findAllPermissions).mockImplementation(
        async () =>
          Promise.resolve(mockedPermission as unknown as Permission[]),
      );
      return await permissionService
        .findAllPermissions(mockedPermission)
        .then((data) => {
          expect(data).toMatchObject(mockedPermission);
        });
    });
  });

  /*
        Get permissions by roleid
    */

  describe("findAllPermissionsByRoleId", () => {
    it("should return all the psrmissions for specific ID", async () => {
      mocked(permissionService.findAllPermissionsByRoleId).mockImplementation(
        async () =>
          await Promise.resolve(mockedPermission as unknown as Permission[]),
      );

      await expect(
        permissionService.findAllPermissionsByRoleId(mockedPermission.roleId),
      ).resolves.toMatchObject(mockedPermission);
    });
  });
});
