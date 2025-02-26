import { TestingModule, Test } from "@nestjs/testing";
import { mocked } from "jest-mock";
import { PluginService } from "../plugin/plugin.service";
import { PluginConfigEntity } from "../plugin/pluginConfig.entity";
import { DefectEntity } from "./defect.entity";
import { DefectService } from "./defect.service";
import { DefectDto } from "./dto/DefectDto";

let pluginService: PluginService;

const mockDefectService = () => ({
  createDefect: jest.fn(),
  updateDefectRefInTestCase: jest.fn(),
  getDefectByKeyAndTestcaseId: jest.fn(),
  getIssueDetailsByKey: jest.fn(),
  getJiraIssueByKey: jest.fn(),
  addDefect: jest.fn(),
  addDefectComment: jest.fn(),
  getDefectDetails: jest.fn(),
});

const mockedPluginService = () => ({
  getJiraPluginConfigByOrgId: jest.fn(),
});

const mockedUser: any = {
  id: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
  firstName: "prem",
  lastName: "last",
  role: "USER",
  email: "prem@yopmail.com",
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff7",
    name: "abcde",
  },
  profileImage: null,
  phone: null,
};

const mockUpdateDefectDto = {
  pluginKey: "key3",
};

const mockedDefectDTO: any = {
  pluginId: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
  pluginKey: "key",
  testcases: [0],
};

const mockedDefects: any = [
  {
    pluginId: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
    pluginKey: "key",
  },
  {
    pluginId: "827af9ff-9156-4c26-9c29-d43cfbe6fff7",
    pluginKey: "key2",
  },
];

const mockedDefectDeatails: any = {
  self: "abcd",
  issueId: "827af9ff-9156-4c26-9c29-d43cfbe6fff9",
  issueKey: "key5",
  project: "project 1",
  issueType: "abcd",
  assignee: "prem",
  priority: "high",
  description: "Do it now",
  sprint: null,
  parent: null,
  summary: "This should be done as soon as possible",
};

describe("DefectService", () => {
  let defectService: DefectService;
  const mockedDefect = mockedDefects[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DefectService,
        {
          provide: DefectService,
          useFactory: mockDefectService,
        },
        PluginService,
        {
          provide: PluginService,
          useFactory: mockedPluginService,
        },
      ],
    }).compile();

    defectService = module.get<DefectService>(DefectService);
    pluginService = module.get<PluginService>(PluginService);
  });

  describe("createDefect", () => {
    it("creates a new defect", async () => {
      expect(mockedDefect).toHaveProperty("pluginId");
      expect(mockedDefect).toHaveProperty("pluginKey");
      mocked(defectService.createDefect).mockImplementation(() =>
        Promise.resolve(mockedDefect as unknown as DefectEntity),
      );
      expect(
        defectService.createDefect(
          mockedDefect.pluginKey,
          mockedDefect.id,
          mockedUser,
        ),
      ).resolves.toBe(mockedDefect);
    });
  });

  describe("updateDefectRefInTestCase", () => {
    it("Should return an error for id with this defect not found", async () => {
      const mockedTestcaseId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(defectService.updateDefectRefInTestCase).mockImplementation(() =>
        Promise.reject(new Error("Defect with this id not found")),
      );
      expect(
        defectService.updateDefectRefInTestCase(
          mockedTestcaseId,
          mockUpdateDefectDto,
          mockedUser,
        ),
      ).rejects.toThrow("Defect with this id not found");
    });

    it("Should update the defect", async () => {
      const mockedDefect: any = mockedDefects[0];

      expect(mockedDefect).toHaveProperty("pluginId");

      mocked(defectService.updateDefectRefInTestCase).mockImplementation(() =>
        Promise.resolve(mockedDefect as DefectDto),
      );

      const newId = "99999999-130d-4019-9287-e8681fb67607";
      const updatedDto: any = mockUpdateDefectDto;
      expect(
        defectService.updateDefectRefInTestCase(newId, updatedDto, mockedUser),
      ).resolves.toBe(mockedDefect);
    });
  });

  describe("getDefectByKeyAndTestcaseId", () => {
    it("Get defects by key and testcase id", async () => {
      const randomTestcaseId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(defectService.getDefectByKeyAndTestcaseId).mockImplementation(() =>
        Promise.reject(
          new Error("Defect with this key and testcaseId  not found"),
        ),
      );

      expect(
        defectService.getDefectByKeyAndTestcaseId(
          mockedDefects.pluginKey,
          randomTestcaseId,
        ),
      ).rejects.toThrow("Defect with this key and testcaseId  not found");
    });

    it("Should return defects with matching key and testcaseId", async () => {
      const randomTestcaseId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(defectService.getDefectByKeyAndTestcaseId).mockImplementation(() =>
        Promise.resolve(mockedDefect as DefectEntity),
      );

      expect(
        defectService.getDefectByKeyAndTestcaseId(
          mockedUser.pluginKey,
          randomTestcaseId,
        ),
      ).resolves.toStrictEqual(mockedDefect);
    });
  });

  describe("getIssueDetailsByKey", () => {
    it("Get issue details by defect key", async () => {
      const mockedDefect = mockedDefects[0];

      mocked(defectService.getIssueDetailsByKey).mockImplementation(() =>
        Promise.resolve(mockedDefect as DefectDto),
      );

      expect(
        defectService.getIssueDetailsByKey(mockedUser.pluginKey, mockedUser),
      ).resolves.toBe(mockedDefect);
    });
  });

  describe("getJiraIssueByKey", () => {
    it("Should return error if get jira issue fails", async () => {
      mocked(defectService.getJiraIssueByKey).mockImplementation(() =>
        Promise.reject(new Error("Defect with this id not found")),
      );

      expect(
        defectService.getJiraIssueByKey(mockedDefect.pluginKey, mockedUser),
      ).rejects.toThrow("Defect with this id not found");
    });

    it("Should return error for Unauthorized", async () => {
      mocked(defectService.getJiraIssueByKey).mockImplementation(() =>
        Promise.reject(new Error("Should return error for Unauthorized")),
      );
      expect(
        defectService.getJiraIssueByKey(mockedDefect.pluginKey, mockedUser),
      ).rejects.toThrow("Should return error for Unauthorized");
    });

    it("Get issue details by defect key", async () => {
      const mockedDefect = mockedDefects[0];
      expect(mockedDefect).toHaveProperty("pluginKey");
      mocked(defectService.getJiraIssueByKey).mockImplementation(() =>
        Promise.resolve(mockedDefect as DefectDto),
      );

      expect(
        defectService.getJiraIssueByKey(mockedUser.pluginKey, mockedUser),
      ).resolves.toBe(mockedDefect);
    });
  });

  describe("addDefect", () => {
    it("Push new defect to the plugin", async () => {
      mocked(defectService.addDefect).mockImplementation(() =>
        Promise.resolve(mockedDefect as unknown as DefectEntity),
      );
      expect(
        defectService.addDefect(mockedDefectDTO, mockedUser),
      ).resolves.toBe(mockedDefect);
    });
  });

  describe("addDefectComment", () => {
    it("Check the defect with orgId", async () => {
      const mockedOrgId = "827af9ff-9156-4c26-9c29-d43cfbe6fff7";
      mocked(pluginService.getJiraPluginConfigByOrgId).mockImplementation(() =>
        Promise.resolve(
          mockedUser.organization.id as unknown as PluginConfigEntity,
        ),
      );
      expect(
        pluginService.getJiraPluginConfigByOrgId(mockedOrgId),
      ).resolves.toBe(mockedOrgId);
    });
    it("Adds comment on a Defect", async () => {
      const mockedComment = "comment";

      mocked(defectService.addDefectComment).mockImplementation(() =>
        Promise.resolve(mockedDefect as unknown as void),
      );
      expect(
        defectService.addDefectComment(mockedDefect, mockedComment, mockedUser),
      ).resolves.toBe(mockedDefect);
    });
  });

  describe("getDefectDetails", () => {
    it("Should return error for defect not found", async () => {
      const randomDefectId = "99999999-130d-4019-9287-e8681fb67607";

      mocked(defectService.getDefectDetails).mockImplementation(() =>
        Promise.reject(new Error("Defect not found")),
      );
      expect(
        defectService.getDefectDetails(randomDefectId, mockedUser),
      ).rejects.toThrow("Defect not found");
    });

    it("Get defect details", async () => {
      const mockedDefect = mockedDefects[0];
      mocked(defectService.getDefectDetails).mockImplementation(() =>
        Promise.resolve(mockedDefect),
      );
      const result = await defectService.getDefectDetails(
        mockedDefectDeatails.issueId,
        mockedUser,
      );
      expect(
        await defectService.getDefectDetails(result.issueId, mockedUser),
      ).toMatchObject(result);
    });
  });
});
