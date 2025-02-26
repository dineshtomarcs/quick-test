import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { MilestoneService } from "./milestone.service";
import { MilestoneEntity } from "./milestone.entity";
import { MilestoneStatus } from "../../common/enums/milestone-status";
import { MilestoneDto } from "./dto/MilestoneDto";
import { MilestoneDetailsDto } from "./dto/MilestoneDetailDto";

const mockedMilestoneService = () => ({
  findOne: jest.fn(),
  createMilestone: jest.fn(),
  deleteMilestone: jest.fn(),
  updateMilestoneStatus: jest.fn(),
  editMilestone: jest.fn(),
  getOpenMilestones: jest.fn(),
  getAllMilestones: jest.fn(),
  milestoneDetail: jest.fn(),
  getActivityMilestones: jest.fn(),
  searchMilestones: jest.fn(),
});

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
  id: "6409d23b-44f8-455e-b5ff-0da8a30a3f7c",
  name: "Project 1",
};

const mockedMilestone: any = {
  id: "3e61d32e-130d-4019-9287-e8681fb67607",
  name: "Milestone 1",
  status: "OPEN",
  description: "sample milestone",
  startDate: "2021-06-17T18:30:00.000Z",
  endDate: "2022-06-23T18:30:00.000Z",
};

const mockedMilestones: any = [
  {
    id: "3e61d32e-130d-4019-9287-e8681fb67607",
    name: "Milestone 1",
    status: "OPEN",
    description: "sample milestone",
    startDate: "2021-06-17T18:30:00.000Z",
    endDate: "2022-06-23T18:30:00.000Z",
  },
  {
    id: "2e61d32e-130d-4019-9287-e8681fb67607",
    name: "Milestone 2",
    status: "COMPLETED",
    description: "sample milestone",
    startDate: "2021-06-17T18:30:00.000Z",
    endDate: "2022-06-17T18:30:00.000Z",
  },
];

describe("MilestoneService", () => {
  let milestoneService: MilestoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MilestoneService,
        {
          provide: MilestoneService,
          useFactory: mockedMilestoneService,
        },
      ],
    }).compile();

    milestoneService = module.get<MilestoneService>(MilestoneService);
  });

  describe("findOne", () => {
    it("should find one Milestone", async () => {
      mocked(milestoneService.findOne).mockImplementation(
        async () =>
          await Promise.resolve(mockedMilestone as unknown as MilestoneEntity),
      );
      expect(await milestoneService.findOne({})).toMatchObject(mockedMilestone);
    });
  });

  /**
   * Testing create new milestone
   */
  describe("createMilestone", () => {
    it("should return error for project not found", async () => {
      const mockedMilestone: any = mockedMilestones[0];

      expect(mockedMilestone).toHaveProperty("name");
      expect(mockedMilestone).toHaveProperty("description");
      expect(mockedMilestone).toHaveProperty("startDate");
      expect(mockedMilestone).toHaveProperty("endDate");

      mocked(milestoneService.createMilestone).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );
      const randomProject: any = {
        id: "88888888-130d-4019-9287-e8681fb67607",
      };
      expect(
        milestoneService.createMilestone(
          mockedMilestone,
          randomProject,
          mockedUser,
        ),
      ).rejects.toThrow("Project not found");
    });

    it("should create a new milestone", async () => {
      const mockedMilestone: any = mockedMilestones[0];

      expect(mockedMilestone).toHaveProperty("name");
      expect(mockedMilestone).toHaveProperty("description");
      expect(mockedMilestone).toHaveProperty("startDate");
      expect(mockedMilestone).toHaveProperty("endDate");

      mocked(milestoneService.createMilestone).mockImplementation(() =>
        Promise.resolve(mockedMilestone as MilestoneEntity),
      );

      expect(
        milestoneService.createMilestone(
          mockedMilestone,
          mockedProject.id,
          mockedUser,
        ),
      ).resolves.toBe(mockedMilestone);
    });
  });

  /**
   * Testing delete milestone
   */
  describe("deleteMilestone", () => {
    it("should return error for milestone with this id not found", async () => {
      const randomMilestoneId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(milestoneService.deleteMilestone).mockImplementation(() =>
        Promise.reject(new Error("Milestone with this id not found")),
      );

      expect(
        milestoneService.deleteMilestone(randomMilestoneId),
      ).rejects.toThrow("Milestone with this id not found");
    });

    it("should delete a milestone", async () => {
      const mockedMilestone: any = mockedMilestones[0];

      expect(mockedMilestone).toHaveProperty("id");

      mocked(milestoneService.deleteMilestone).mockImplementation(() =>
        Promise.resolve(true),
      );

      expect(
        milestoneService.deleteMilestone(mockedMilestone.id),
      ).resolves.toBeTruthy();
    });
  });

  /**
   * Testing update milestone status to completed
   */
  describe("updateMilestoneStatus", () => {
    it("should return error for milestone with this id not found", async () => {
      const randomMilestoneId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(milestoneService.updateMilestoneStatus).mockImplementation(() =>
        Promise.reject(new Error("Milestone with this id not found")),
      );
      const milestoneStatus = {
        status: MilestoneStatus.COMPLETED,
      };
      expect(
        milestoneService.updateMilestoneStatus(
          milestoneStatus,
          randomMilestoneId,
          mockedUser,
        ),
      ).rejects.toThrow("Milestone with this id not found");
    });

    it("should return error for incorrect milestone status", async () => {
      const mockedMilestone = mockedMilestones[0];

      expect(mockedMilestone).toHaveProperty("id");

      mocked(milestoneService.updateMilestoneStatus).mockImplementation(() =>
        Promise.reject(new Error("Milestone status incorrect")),
      );
      const milestoneStatus = {
        status: MilestoneStatus.START,
      };
      expect(
        milestoneService.updateMilestoneStatus(
          milestoneStatus,
          mockedMilestone.id,
          mockedUser,
        ),
      ).rejects.toThrow("Milestone status incorrect");
    });

    it("should update the milestone status", async () => {
      const mockedMilestone: any = mockedMilestones[0];

      expect(mockedMilestone).toHaveProperty("id");

      mocked(milestoneService.updateMilestoneStatus).mockImplementation(() =>
        Promise.resolve(mockedMilestone as MilestoneEntity),
      );
      const milestoneStatus = {
        status: MilestoneStatus.COMPLETED,
      };
      expect(
        milestoneService.updateMilestoneStatus(
          milestoneStatus,
          mockedMilestone.id,
          mockedUser,
        ),
      ).resolves.toBe(mockedMilestone);
    });
  });

  /**
   * Testing update milestone
   */
  describe("editMilestone", () => {
    it("should return error for milestone with this id not found", async () => {
      const randomMilestoneId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(milestoneService.editMilestone).mockImplementation(() =>
        Promise.reject(new Error("Milestone with this id not found")),
      );

      const update: any = {
        name: "Milestone 3",
      };
      expect(
        milestoneService.editMilestone(update, randomMilestoneId),
      ).rejects.toThrow("Milestone with this id not found");
    });

    it("should update the milestone", async () => {
      const mockedMilestone: any = mockedMilestones[0];

      expect(mockedMilestone).toHaveProperty("id");

      mocked(milestoneService.editMilestone).mockImplementation(() =>
        Promise.resolve(mockedMilestone as MilestoneEntity),
      );

      const update: any = {
        name: "Milestone 3",
        description: "Milestone description",
      };
      expect(
        milestoneService.editMilestone(update, mockedMilestone.id),
      ).resolves.toBe(mockedMilestone);
    });
  });

  /**
   * Testing get all open milestones for
   * a project
   */
  describe("getOpenMilestones", () => {
    it("should return error for project not found", async () => {
      const randomProjectId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(milestoneService.getOpenMilestones).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      expect(
        milestoneService.getOpenMilestones(randomProjectId),
      ).rejects.toThrow("Project not found");
    });

    it("should return all open milestones for a project", async () => {
      const mockedOpenMilestones: any = mockedMilestones.filter(
        (milestone) => milestone.status === MilestoneStatus.OPEN,
      );

      mocked(milestoneService.getOpenMilestones).mockImplementation(() =>
        Promise.resolve(mockedOpenMilestones as MilestoneDto[]),
      );

      expect(
        milestoneService.getOpenMilestones(mockedProject.id),
      ).resolves.toStrictEqual(mockedOpenMilestones);
    });
  });

  /**
   * Testing get all milestones for
   * a project
   */
  describe("getAllMilestones", () => {
    it("should return error for project not found", async () => {
      const randomProjectId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(milestoneService.getAllMilestones).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      expect(
        milestoneService.getAllMilestones(randomProjectId),
      ).rejects.toThrow("Project not found");
    });

    it("should return all milestones for a project", async () => {
      mocked(milestoneService.getAllMilestones).mockImplementation(() =>
        Promise.resolve(mockedMilestones as MilestoneDetailsDto[]),
      );

      expect(
        milestoneService.getAllMilestones(mockedProject.id),
      ).resolves.toStrictEqual(mockedMilestones);
    });
  });

  /**
   * Testing get milestone details
   */
  describe("milestoneDetail", () => {
    it("should return milestone details", async () => {
      const mockedMilestone = mockedMilestones[0];

      mocked(milestoneService.milestoneDetail).mockImplementation(() =>
        Promise.resolve(mockedMilestone as MilestoneDetailsDto),
      );

      expect(
        milestoneService.milestoneDetail(mockedMilestone.id),
      ).resolves.toBe(mockedMilestone);
    });
  });

  /**
   * Testing get not completed milestones for
   * a project
   */
  describe("getActivityMilestones", () => {
    it("should return error for project not found", async () => {
      const randomProjectId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(milestoneService.getActivityMilestones).mockImplementation(() =>
        Promise.reject(new Error("Project not found")),
      );

      const mockedPageOptions: any = {
        take: 2,
      };
      expect(
        milestoneService.getActivityMilestones(
          randomProjectId,
          mockedPageOptions,
        ),
      ).rejects.toThrow("Project not found");
    });

    it("should return not completed milestones for a project", async () => {
      const mockedActiveMilestones: any = mockedMilestones.filter(
        (milestone) => milestone.status !== MilestoneStatus.COMPLETED,
      );

      mocked(milestoneService.getActivityMilestones).mockImplementation(() =>
        Promise.resolve(mockedActiveMilestones as MilestoneDto[]),
      );

      const mockedPageOptions: any = {
        take: 2,
      };
      expect(
        milestoneService.getActivityMilestones(
          mockedProject.id,
          mockedPageOptions,
        ),
      ).resolves.toStrictEqual(mockedActiveMilestones);
    });
  });

  /**
   * Testing to get search results for milestones
   */
  describe("searchMilestones", () => {
    it("should return test case search result", async () => {
      const searchMilestoneName = "mile";
      const searchResult = mockedMilestones.filter((milestone) => {
        const string1 = milestone.name.toLowerCase();
        const string2 = searchMilestoneName.toLowerCase();
        return string1.includes(string2);
      });

      mocked(milestoneService.searchMilestones).mockImplementation(() =>
        Promise.resolve(searchResult as MilestoneDetailsDto[]),
      );
      expect(
        milestoneService.searchMilestones(searchMilestoneName, mockedUser),
      ).resolves.toStrictEqual(mockedMilestones);
    });
  });
});
