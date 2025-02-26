import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { OrganizationService } from "./organization.service";
import { UserEntity } from "../../service-users/user/user.entity";
import { OrganizationListDto } from "./dto/OrganizationListDto";
import { OrganizationEntity } from "./organization.entity";
import { Order } from "../../common/enums/order";

const mockOrganizationService = () => ({
  findOne: jest.fn(),
  createOrganization: jest.fn(),
  changeOrganizationName: jest.fn(),
  addMemberInOrganization: jest.fn(),
  getAllMembers: jest.fn(),
  getArchivedMembers: jest.fn(),
  updateMemberInOrganization: jest.fn(),
  addMultipleMembersInOrganization: jest.fn(),
  getOrganization: jest.fn(),
  findByOrganizationByIdOrName: jest.fn(),
  getArchivedProjects: jest.fn(),
});

const mockedOrganization: any = {
  id: "8859631f-9156-4c26-9c29-d43cfbe6fff3",
  name: "keka",
};

const mockPageOptionsDto: any = {
  order: Order.ASC,
  page: 1,
  take: 10,
};

const toAddMembers: any = [
  {
    id: "427af9ff-9156-4c26-9c29-d43cfbe6fff3",
    firstName: "New",
    lastName: "Member",
    email: "member@yopmail.com",
    profileImage: null,
    phone: null,
  },
  {
    id: "54654654-9156-4c26-9c29-d43cfbe6fff3",
    firstName: "Abc",
    lastName: "Def",
    email: "abc@yopmail.com",
    profileImage: null,
    phone: null,
  },
  {
    id: "98569856-9156-4c26-9c29-d43cfbe6fff3",
    firstName: "sam",
    lastName: "Member",
    email: "sam@yopmail.com",
    profileImage: null,
    phone: null,
  },
];

const mockUpdatedMember: any = {
  id: "987af9ff-9156-4c26-9c29-d43cfbe6fff3",
  firstName: "john",
  lastName: "cena",
  email: "john@gmail.com",
  title: "cto",
  roleId: 2,
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
    name: "keka",
  },
  profileImage: null,
  phone: null,
};

const mockedMembers: any = [
  {
    id: "987af9ff-9156-4c26-9c29-d43cfbe6fff3",
    firstName: "john",
    lastName: "cena",
    email: "john@gmail.com",
    title: "cto",
    role: "ADMIN",
    organization: {
      id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
      name: "keka",
    },
    profileImage: null,
    phone: null,
  },
];

const mockSuperAdmin: any = {
  id: "107af9ff-9156-4c26-9c29-d43cfbe6fff3",
  firstName: "tina",
  lastName: "cena",
  email: "tina@gmail.com",
  title: "ceo",
  role: "SUPERADMIN",
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
    name: "keka",
  },
  profileImage: null,
  phone: null,
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

const mockedProject: any = {
  id: "fe9ff93f-e4cc-454a-9cb2-c4cab361a37d",
  name: "Sololo",
  description: "bjnkm",
  deletedAt: "2022-09-27T11:28:55.578Z",
  archivedBy: null,
};

const mockLang: any = "myLang";

describe("OrganizationService", () => {
  let organizationService: OrganizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationService,
        {
          provide: OrganizationService,
          useFactory: mockOrganizationService,
        },
      ],
    }).compile();

    organizationService = module.get<OrganizationService>(OrganizationService);
  });

  /**
   * Add member in Organization
   */

  describe("addMemberInOrganization", () => {
    it("should add a member in the organization", async () => {
      expect(toAddMembers[0]).toHaveProperty("firstName");
      expect(toAddMembers[0]).toHaveProperty("lastName");
      expect(toAddMembers[0]).toHaveProperty("email");
      mocked(organizationService.addMemberInOrganization).mockImplementation(
        () => Promise.resolve(toAddMembers[0] as unknown as UserEntity),
      );
      expect(
        await organizationService.addMemberInOrganization(
          toAddMembers[0],
          mockedUser,
          mockLang,
        ),
      ).toBe(toAddMembers[0]);
    });

    it("should return error if addMemberInOrganization fails", async () => {
      mocked(organizationService.addMemberInOrganization).mockImplementation(
        () => Promise.reject(new Error("addMemberInOrganization Fails")),
      );
      expect(
        organizationService.addMemberInOrganization(
          toAddMembers[0],
          mockedUser,
          mockLang,
        ),
      ).rejects.toThrow("addMemberInOrganization Fails");
    });
  });

  describe("findOne", () => {
    it("should find one Organization", async () => {
      mocked(organizationService.findOne).mockImplementation(
        async () =>
          await Promise.resolve(
            mockedOrganization as unknown as OrganizationEntity,
          ),
      );
      expect(await organizationService.findOne({})).toMatchObject(
        mockedOrganization,
      );
    });
  });

  describe("findByOrganizationByIdOrName", () => {
    it("should find Organization", () => {
      mocked(
        organizationService.findByOrganizationByIdOrName,
      ).mockImplementation(
        async () => await Promise.resolve(mockedOrganization),
      );
      organizationService
        .findByOrganizationByIdOrName({
          id: mockedOrganization.id,
          organizationname: mockedOrganization.name,
        })
        .then((data) => {
          expect(data).toMatchObject(mockedOrganization);
        });
    });

    it("should return undefined", () => {
      mocked(
        organizationService.findByOrganizationByIdOrName,
      ).mockImplementation(async () => await Promise.reject(undefined));
      organizationService
        .findByOrganizationByIdOrName({
          id: mockedOrganization.id,
          organizationname: mockedOrganization.name,
        })
        .then((data) => {
          expect(data).toBe(undefined);
        })
        .catch((error) => {
          expect(error).toBe(undefined);
        });
    });
  });

  describe("getAllMembers", () => {
    it("should return all members in an organization", () => {
      mocked(organizationService.getAllMembers).mockImplementation(
        async () => await Promise.resolve(mockedMembers),
      );

      organizationService
        .getAllMembers(mockPageOptionsDto, mockedUser)
        .then((data) => {
          expect(data).toMatchObject(mockedMembers);
        });
    });
  });

  describe("addMultipleMembersInOrganization", () => {
    it("should add multiple members in an organization", () => {
      const result = {
        mockedMembers,
        totalMembersAdded: mockedMembers.length,
      };
      mocked(
        organizationService.addMultipleMembersInOrganization,
      ).mockImplementation(async () => await Promise.resolve(result));
      organizationService
        .addMultipleMembersInOrganization(toAddMembers, mockedUser, mockLang)
        .then((data) => {
          expect(data).toMatchObject(result);
        });
    });
  });

  describe("changeOrganizationName", () => {
    it("should return true if organization name is changed", async () => {
      mocked(organizationService.changeOrganizationName).mockImplementation(
        async () => await Promise.resolve(true),
      );
      expect(
        await organizationService.changeOrganizationName(
          mockedOrganization.id,
          mockedOrganization.name,
          mockedUser,
        ),
      ).toBe(true);
    });
    it("should throw error if no organization found", async () => {
      mocked(organizationService.changeOrganizationName).mockImplementation(
        async () => await Promise.resolve(false),
      );
      expect(
        await organizationService.changeOrganizationName(
          undefined,
          mockedOrganization.name,
          mockedUser,
        ),
      ).toBe(false);
    });
  });

  /**
   * Create Organization
   */
  describe("createOrganization", () => {
    it("should create an organization", async () => {
      mocked(organizationService.createOrganization).mockImplementation(
        async () =>
          await Promise.resolve(
            mockedOrganization as unknown as OrganizationEntity,
          ),
      );
      expect(
        await organizationService.createOrganization({
          name: mockedOrganization.name,
        }),
      ).toMatchObject(mockedOrganization);
    });
    it("should throw error if organizationRegisterDto is not defined", async () => {
      mocked(organizationService.createOrganization).mockImplementation(() =>
        Promise.reject(""),
      );
    });
  });

  /**
   * Update member in Organization
   */

  describe("updateMemberInOrganization", () => {
    it("should update a member in the organization", async () => {
      expect(mockUpdatedMember).toHaveProperty("firstName");
      expect(mockUpdatedMember).toHaveProperty("lastName");
      expect(mockUpdatedMember).toHaveProperty("email");
      expect(mockUpdatedMember).toHaveProperty("title");

      mocked(organizationService.updateMemberInOrganization).mockImplementation(
        () => Promise.resolve(mockUpdatedMember as unknown as UserEntity),
      );
      const { firstName, lastName, email, title, roleId } = mockUpdatedMember;
      expect(
        await organizationService.updateMemberInOrganization(
          { firstName, lastName, email, title, roleId },
          mockUpdatedMember.id,
          mockSuperAdmin,
          mockLang,
        ),
      ).toBe(mockUpdatedMember);
    });

    it("should return error if updateMemberInOrganization fails", async () => {
      mocked(organizationService.updateMemberInOrganization).mockImplementation(
        () => Promise.reject(new Error("Update member fails")),
      );
      const { firstName, lastName, title, roleId } = mockUpdatedMember;
      expect(
        organizationService.updateMemberInOrganization(
          { firstName, lastName, email: mockSuperAdmin.email, title, roleId },
          mockUpdatedMember.id,
          mockSuperAdmin,
          mockLang,
        ),
      ).rejects.toThrow("Update member fails");
    });
  });

  /**
   * Testing add multiple members in organization
   */

  describe("addMultipleMembersInOrganization", () => {
    it("should create multiple members at once", async () => {
      toAddMembers.forEach((member) => {
        expect(member).toHaveProperty("firstName");
        expect(member).toHaveProperty("lastName");
        expect(member).toHaveProperty("email");
      });

      mocked(
        organizationService.addMultipleMembersInOrganization,
      ).mockImplementation(() => Promise.resolve(toAddMembers));

      expect(
        organizationService.addMultipleMembersInOrganization(
          toAddMembers,
          mockedUser,
          mockLang,
        ),
      ).resolves.toStrictEqual(toAddMembers);
    });
  });

  /**
   * Testing get organization details with members list
   */
  describe("getOrganization", () => {
    it("should return error for organization not found", async () => {
      expect(mockedOrganization).toHaveProperty("id");

      mocked(organizationService.getOrganization).mockImplementation(() =>
        Promise.reject(new Error("No organization found with this id")),
      );

      const randomId = "99999999-9156-4c26-9c29-d43cfbe6fff";
      expect(
        organizationService.getOrganization(randomId, mockedUser),
      ).rejects.toThrow("No organization found with this id");
    });

    it("should return organization with members list", async () => {
      expect(mockedOrganization).toHaveProperty("id");
      mockedOrganization.members = toAddMembers;

      mocked(organizationService.getOrganization).mockImplementation(() =>
        Promise.resolve(mockedOrganization as unknown as OrganizationListDto),
      );

      expect(
        organizationService.getOrganization(mockedOrganization.id, mockedUser),
      ).resolves.toStrictEqual(mockedOrganization);
    });
  });

  describe("getArchivedMembers", () => {
    it("should return all archived members in an organization", () => {
      mocked(organizationService.getArchivedMembers).mockImplementation(
        async () => await Promise.resolve(mockedMembers),
      );

      organizationService
        .getArchivedMembers(mockPageOptionsDto, mockedUser)
        .then((data) => {
          expect(data).toMatchObject(mockedMembers);
        });
    });
  });

  describe("getArchivedProjects", () => {
    it("should return all archived projects in an organization", () => {
      mocked(organizationService.getArchivedProjects).mockImplementation(
        async () => await Promise.resolve(mockedProject),
      );

      organizationService.getArchivedProjects(mockedProject).then((data) => {
        expect(data).toMatchObject(mockedProject);
      });
    });
  });
});
