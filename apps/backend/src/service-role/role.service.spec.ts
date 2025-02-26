import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { RoleEntity } from "./role.entity";
import { RoleService } from "./role.service";

const mockRoleService = () => ({
  createRole: jest.fn(),
  findRoleById: jest.fn(),
  findByRoleType: jest.fn(),
});

const mockedRole: any = {
  id: 2,
  roleType: "ORGADMIN",
  createdAt: "",
  updatedAt: "",
};

const mockRoleDto: any = {
  roleType: "ORGADMIN",
};

describe("RoleService", () => {
  let roleService: RoleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: RoleService,
          useFactory: mockRoleService,
        },
      ],
    }).compile();

    roleService = module.get<RoleService>(RoleService);
  });

  /*   Creates a Role */

  describe("createRole", () => {
    it("it should create a Role", () => {
      mocked(roleService.createRole).mockImplementation(() =>
        Promise.resolve(mockRoleDto),
      );
      expect(
        roleService.createRole(mockedRole.roleType).then((data) => {
          expect(data).toMatchObject(mockRoleDto);
        }),
      );
    });
  });

  /*
        Get role by id
    */

  describe("findRoleById", () => {
    it("should return the role for specific ID", async () => {
      mocked(roleService.findRoleById).mockImplementation(
        async () => await Promise.resolve(mockedRole as unknown as RoleEntity),
      );

      await expect(
        roleService.findRoleById(mockedRole.id),
      ).resolves.toMatchObject(mockedRole);
    });
  });

  /*  Get role by id   */

  describe("findByRoleType", () => {
    it("should return the roleType", async () => {
      mocked(roleService.findByRoleType).mockImplementation(
        async () => await Promise.resolve(mockedRole as unknown as RoleEntity),
      );

      await expect(
        roleService.findByRoleType(mockedRole.roleType),
      ).resolves.toMatchObject(mockedRole);
    });
  });
});
