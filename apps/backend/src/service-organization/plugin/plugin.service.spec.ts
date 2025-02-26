import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { PluginService } from "./plugin.service";
import { RoleType } from "../../common/enums/role-type";
import { Plugins } from "../../common/enums/plugins";
import { AddPluginConfigDto } from "./dto/AddPluginConfigDto";
import { PluginConfigDto } from "./dto/PluginConfigDto";
import { PluginConfigEntity } from "./pluginConfig.entity";
import { UpdatePluginConfigDto } from "./dto/UpdatePluginConfigDto";
import { TestCaseResultStatus } from "../../common/enums/test-case-result-status";

const mockedPluginService = () => ({
  addPluginConfig: jest.fn(),
  getJiraPluginConfigByOrgId: jest.fn(),
  getPluginConfigById: jest.fn(),
  verifyJiraPlugin: jest.fn(),
  updatePluginConfig: jest.fn(),
  getPluginProjects: jest.fn(),
  getJiraProjectList: jest.fn(),
  getAllIssueKeysInPluginProject: jest.fn(),
  getJiraIssueKeysByProjectKey: jest.fn(),
  getAllIssueTypesInPluginProject: jest.fn(),
  getJiraIssueTypesByProjecId: jest.fn(),
  getAllUsersInPluginProject: jest.fn(),
  getAllUsersInJiraProject: jest.fn(),
  getSprintsInPluginProject: jest.fn(),
  getSprintsFromJiraProject: jest.fn(),
  getAllBoardsInJira: jest.fn(),
  getSprintsInJiraBoard: jest.fn(),
  addJiraIssue: jest.fn(),
  getJiraSprintCustomField: jest.fn(),
  addCommentInJiraIssue: jest.fn(),
  attachImageInJiraIssue: jest.fn(),
});

const mockedPluginConfigs: any = [
  {
    isIntegrated: false,
    plugin: Plugins.JIRA,
    username: "user@yopmail.com",
    webAddress: "https:crownstack.atlassian.com/",
    accessToken: "hsId73djDSK9sd8d3mDn",
    organization: {
      id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
      name: "crownstack",
    },
    id: "9uuaf9ff-9156-4c26-9c29-d43cfbe6fff3",
  },
];
const mockedUser: any = {
  id: "827af9ff-9156-4c26-9c29-d43cfbe6fff3",
  firstName: "User",
  role: RoleType.ORGADMIN,
  email: "user@yopmail.com",
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
    name: "crownstack",
  },
};

describe("PluginService", () => {
  let pluginService: PluginService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PluginService,
        {
          provide: PluginService,
          useFactory: mockedPluginService,
        },
      ],
    }).compile();

    pluginService = module.get<PluginService>(PluginService);
  });

  describe("addPluginConfig", () => {
    const mockedCredentials: AddPluginConfigDto = {
      webAddress: mockedPluginConfigs[0].webAddress,
      userName: mockedPluginConfigs[0].username,
      accessToken: mockedPluginConfigs[0].accessToken,
      plugin: Plugins.JIRA,
    };
    it("should throw an error for invalid credentials", async () => {
      mockedCredentials.accessToken = "randomToken";

      mocked(pluginService.addPluginConfig).mockImplementation(() =>
        Promise.reject(new Error("Invalid Credentials")),
      );
      expect(
        pluginService.addPluginConfig(mockedCredentials, mockedUser),
      ).rejects.toThrow("Invalid Credentials");
    });

    mockedCredentials.accessToken = mockedPluginConfigs[0].accessToken;

    it("should throw an error for duplicate plugin config", async () => {
      expect(mockedCredentials).toHaveProperty("webAddress");
      expect(mockedCredentials).toHaveProperty("userName");
      expect(mockedCredentials).toHaveProperty("accessToken");
      expect(mockedCredentials).toHaveProperty("plugin");

      const pluginConfigDto = mockedPluginConfigs[0];

      mocked(pluginService.addPluginConfig).mockImplementation(() =>
        Promise.resolve(pluginConfigDto as unknown as PluginConfigDto),
      );
      expect(
        pluginService.addPluginConfig(mockedCredentials, mockedUser),
      ).resolves.toEqual(pluginConfigDto);
    });
    it("should throw an error for duplicate plugin config", async () => {
      mocked(pluginService.addPluginConfig).mockImplementation(() =>
        Promise.reject(new Error("Duplicate Plugin Config")),
      );
      expect(
        pluginService.addPluginConfig(mockedCredentials, mockedUser),
      ).rejects.toThrow("Duplicate Plugin Config");
    });
  });

  describe("getJiraPluginConfigByOrgId", () => {
    it("should return null for incorrect organization id", async () => {
      const organizationId = "907af9ff-9156-4c26-9c29-d43cfbe6fff6";

      mocked(pluginService.getJiraPluginConfigByOrgId).mockImplementation(() =>
        Promise.resolve(null),
      );
      expect(
        pluginService.getJiraPluginConfigByOrgId(organizationId),
      ).resolves.toBeNull();
    });
    it("should return plugin config entity", async () => {
      const organizationId = mockedUser.organization.id;
      const pluginConfig = mockedPluginConfigs[0];
      mocked(pluginService.getJiraPluginConfigByOrgId).mockImplementation(() =>
        Promise.resolve(pluginConfig as PluginConfigEntity),
      );
      expect(
        pluginService.getJiraPluginConfigByOrgId(organizationId),
      ).resolves.toEqual(pluginConfig);
    });
  });

  describe("getPluginConfigById", () => {
    it("should return null for incorrect plugin config id", async () => {
      const pluginConfigId = "1s7af9ff-9156-4c26-9c29-d43cfbe6fff6";

      mocked(pluginService.getPluginConfigById).mockImplementation(() =>
        Promise.resolve(null),
      );
      expect(
        pluginService.getPluginConfigById(pluginConfigId),
      ).resolves.toBeNull();
    });
    it("should return plugin config entity", async () => {
      const pluginConfig = mockedPluginConfigs[0];
      mocked(pluginService.getPluginConfigById).mockImplementation(() =>
        Promise.resolve(pluginConfig as PluginConfigEntity),
      );
      expect(
        pluginService.getPluginConfigById(pluginConfig.id),
      ).resolves.toEqual(pluginConfig);
    });
  });

  describe("verifyJiraPlugin", () => {
    it("should throw an error for unauthorized", async () => {
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";

      mocked(pluginService.verifyJiraPlugin).mockImplementation(() =>
        Promise.reject(new Error("User not authorized")),
      );
      expect(pluginService.verifyJiraPlugin(credentials)).rejects.toThrow(
        "User not authorized",
      );
    });
    it("should return true after verifying  credentials", async () => {
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.verifyJiraPlugin).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(pluginService.verifyJiraPlugin(credentials)).resolves.toBeTruthy();
    });
  });

  describe("updatePluginConfig", () => {
    it("should throw an error plugin config not found", async () => {
      const id = "329847ff-9156-4c26-9c29-d43cfbe6fff6";
      const updatePluginConfig: UpdatePluginConfigDto = {
        accessToken: null,
        webAddress: null,
        userName: "newUser@yopmail.com",
      };

      mocked(pluginService.updatePluginConfig).mockImplementation(() =>
        Promise.reject(new Error("Plugin config not found")),
      );
      expect(
        pluginService.updatePluginConfig(id, updatePluginConfig, mockedUser),
      ).rejects.toThrow("Plugin config not found");
    });

    it("should thrown an error for invalid credentials", async () => {
      const { id } = mockedPluginConfigs[0];
      const updatePluginConfig: UpdatePluginConfigDto = {
        accessToken: null,
        webAddress: null,
        userName: "newUser@yopmail.com",
      };

      mocked(pluginService.updatePluginConfig).mockImplementation(() =>
        Promise.reject(new Error("Invalid Plugin Credentials")),
      );
      expect(
        pluginService.updatePluginConfig(id, updatePluginConfig, mockedUser),
      ).rejects.toThrow("Invalid Plugin Credentials");
    });
    it("should return updated plugin config ", async () => {
      const { id } = mockedPluginConfigs[0];
      const updatePluginConfig: UpdatePluginConfigDto = {
        accessToken: null,
        webAddress: null,
        userName: "newUser@yopmail.com",
      };

      const updatedPluginConfig: PluginConfigDto = mockedPluginConfigs[0];
      updatedPluginConfig.userName = updatedPluginConfig.userName;

      mocked(pluginService.updatePluginConfig).mockImplementation(() =>
        Promise.resolve(updatedPluginConfig),
      );

      expect(
        pluginService.updatePluginConfig(id, updatePluginConfig, mockedUser),
      ).resolves.toStrictEqual(updatedPluginConfig);
    });
  });

  describe("getPluginProjects", () => {
    it("should throw an error for invlaid plugin credentials", async () => {
      const user = mockedUser;
      user.organization.id = "1111f9ff-9156-4c26-9c29-d43cfbe6fff3";
      mocked(pluginService.getPluginProjects).mockImplementation(() =>
        Promise.reject(new Error("Invalid Plugin Credentials")),
      );
      expect(pluginService.getPluginProjects(user)).rejects.toThrow(
        "Invalid Plugin Credentials",
      );
    });

    it("should return projects in plugin", async () => {
      const projectList = [
        { id: 11002, key: "BP", name: "Quick Test" },
        { id: 11001, name: "ServiceShaft", key: "SS" },
      ];

      mocked(pluginService.getPluginProjects).mockImplementation(() =>
        Promise.resolve(projectList),
      );

      expect(
        pluginService.getPluginProjects(mockedUser),
      ).resolves.toStrictEqual(projectList);
    });
  });

  describe("getJiraProjectList", () => {
    it("should throw an error for unauthorized", async () => {
      const credentials: PluginConfigEntity = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";

      mocked(pluginService.getJiraProjectList).mockImplementation(() =>
        Promise.reject(new Error("User not authorized")),
      );

      expect(pluginService.getJiraProjectList(credentials)).rejects.toThrow(
        "User not authorized",
      );
    });
    it("should return projects in plugin", async () => {
      const credentials: PluginConfigEntity = mockedPluginConfigs[0];
      const projectList = [
        { id: 11002, key: "BP", name: "Quick Test" },
        { id: 11001, name: "ServiceShaft", key: "SS" },
      ];

      mocked(pluginService.getJiraProjectList).mockImplementation(() =>
        Promise.resolve(projectList),
      );

      expect(
        pluginService.getJiraProjectList(credentials),
      ).resolves.toStrictEqual(projectList);
    });
  });

  describe("getAllIssueKeysInPluginProject", () => {
    it("should throw an error for project key required", async () => {
      const projectKey = null;
      const subtask = false;
      mocked(pluginService.getAllIssueKeysInPluginProject).mockImplementation(
        () => Promise.reject(new Error("Project key is required")),
      );
      expect(
        pluginService.getAllIssueKeysInPluginProject(
          projectKey,
          subtask,
          mockedUser,
        ),
      ).rejects.toThrow("Project key is required");
    });

    it("should return issue list without subtasks", async () => {
      const projectKey = "BP";
      const subtask = false;
      const issues = [
        { id: 11001, key: "BP-11", type: "Task" },
        { id: 11002, key: "BP-112", type: "BUg" },
      ];
      mocked(pluginService.getAllIssueKeysInPluginProject).mockImplementation(
        () => Promise.resolve(issues),
      );

      expect(
        pluginService.getAllIssueKeysInPluginProject(
          projectKey,
          subtask,
          mockedUser,
        ),
      ).resolves.toStrictEqual(issues);
    });
  });

  describe("getJiraIssueKeysByProjectKey", () => {
    it("should throw an error for project not found", async () => {
      const projectKey = "LS";
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.getJiraIssueKeysByProjectKey).mockImplementation(
        () => Promise.reject(new Error("Project with this key not found")),
      );
      expect(
        pluginService.getJiraIssueKeysByProjectKey(projectKey, credentials),
      ).rejects.toThrow("Project with this key not found");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const projectKey = "BP";
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.getJiraIssueKeysByProjectKey).mockImplementation(
        () => Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getJiraIssueKeysByProjectKey(projectKey, credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return issues in that project", async () => {
      const projectKey = "BP";
      const credentials = mockedPluginConfigs[0];
      const issues = [
        { id: 11001, key: "BP-11", type: "Task" },
        { id: 11002, key: "BP-112", type: "BUg" },
      ];
      mocked(pluginService.getJiraIssueKeysByProjectKey).mockImplementation(
        () => Promise.resolve(issues),
      );

      expect(
        pluginService.getJiraIssueKeysByProjectKey(projectKey, credentials),
      ).resolves.toStrictEqual(issues);
    });
  });

  describe("getAllIssueTypesInPluginProject", () => {
    it("should throw an error for project id is required", async () => {
      const projectId = null;
      mocked(pluginService.getAllIssueTypesInPluginProject).mockImplementation(
        () => Promise.reject(new Error("Project id is required")),
      );
      expect(
        pluginService.getAllIssueTypesInPluginProject(projectId, mockedUser),
      ).rejects.toThrow("Project id is required");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const projectId = "11001";
      const user = mockedUser;
      user.organization.id = "99009900-9156-4c26-9c29-d43cfbe6fff6";
      mocked(pluginService.getAllIssueTypesInPluginProject).mockImplementation(
        () => Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getAllIssueTypesInPluginProject(projectId, user),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return issues types for the project", async () => {
      const projectId = "11001";
      const issueTypes = [
        { id: 1, name: "task" },
        { id: 2, name: "bug" },
      ];
      mocked(pluginService.getAllIssueTypesInPluginProject).mockImplementation(
        () => Promise.resolve(issueTypes),
      );

      expect(
        pluginService.getAllIssueTypesInPluginProject(projectId, mockedUser),
      ).resolves.toStrictEqual(issueTypes);
    });
  });

  describe("getJiraIssueTypesByProjecId", () => {
    it("should throw an error for project not found", async () => {
      const projectId = "00000";
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.getJiraIssueTypesByProjecId).mockImplementation(() =>
        Promise.reject(new Error("Project with this id not found")),
      );
      expect(
        pluginService.getJiraIssueTypesByProjecId(projectId, credentials),
      ).rejects.toThrow("Project with this id not found");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const projectId = "11001";
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.getJiraIssueTypesByProjecId).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getJiraIssueTypesByProjecId(projectId, credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return all issue types in that project", async () => {
      const projectId = "11001";
      const credentials = mockedPluginConfigs[0];
      const issueTypes = [
        { id: 1, name: "task" },
        { id: 2, name: "bug" },
      ];
      mocked(pluginService.getJiraIssueTypesByProjecId).mockImplementation(() =>
        Promise.resolve(issueTypes),
      );

      expect(
        pluginService.getJiraIssueTypesByProjecId(projectId, credentials),
      ).resolves.toStrictEqual(issueTypes);
    });
  });

  describe("getAllUsersInPluginProject", () => {
    it("should throw an error for project id is required", async () => {
      const projectId = null;
      mocked(pluginService.getAllUsersInPluginProject).mockImplementation(() =>
        Promise.reject(new Error("Project id is required")),
      );
      expect(
        pluginService.getAllUsersInPluginProject(projectId, mockedUser),
      ).rejects.toThrow("Project id is required");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const projectId = "11001";
      const user = mockedUser;
      user.organization.id = "99009900-9156-4c26-9c29-d43cfbe6fff6";
      mocked(pluginService.getAllUsersInPluginProject).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getAllUsersInPluginProject(projectId, user),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return users in the project", async () => {
      const projectId = "11001";
      const users = [
        {
          id: 33232232323,
          name: "John",
          email: "john@yopmail.com",
          projectId: "11001",
        },
        {
          id: 45232232323,
          name: "Rick",
          email: "rick@yopmail.com",
          projectId: "11001",
        },
        {
          id: 11232232323,
          name: "Denny",
          email: "denny@yopmail.com",
          projectId: "11001",
        },
      ];
      mocked(pluginService.getAllUsersInPluginProject).mockImplementation(() =>
        Promise.resolve(users),
      );

      expect(
        pluginService.getAllUsersInPluginProject(projectId, mockedUser),
      ).resolves.toStrictEqual(users);
    });
  });

  describe("getAllUsersInJiraProject", () => {
    it("should throw an error for project not found", async () => {
      const projectId = "00000";
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.getAllUsersInJiraProject).mockImplementation(() =>
        Promise.reject(new Error("Project with this id not found")),
      );
      expect(
        pluginService.getAllUsersInJiraProject(projectId, credentials),
      ).rejects.toThrow("Project with this id not found");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const projectId = "11001";
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.getAllUsersInJiraProject).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getAllUsersInJiraProject(projectId, credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return all users in that project", async () => {
      const projectId = "11001";
      const credentials = mockedPluginConfigs[0];
      const users = [
        {
          id: 33232232323,
          name: "John",
          email: "john@yopmail.com",
          projectId: "11001",
        },
        {
          id: 45232232323,
          name: "Rick",
          email: "rick@yopmail.com",
          projectId: "11001",
        },
        {
          id: 11232232323,
          name: "Denny",
          email: "denny@yopmail.com",
          projectId: "11001",
        },
      ];
      mocked(pluginService.getAllUsersInJiraProject).mockImplementation(() =>
        Promise.resolve(users),
      );

      expect(
        pluginService.getAllUsersInJiraProject(projectId, credentials),
      ).resolves.toStrictEqual(users);
    });
  });

  describe("getSprintsInPluginProject", () => {
    it("should throw an error for project id is required", async () => {
      const projectId = null;
      mocked(pluginService.getSprintsInPluginProject).mockImplementation(() =>
        Promise.reject(new Error("Project id is required")),
      );
      expect(
        pluginService.getSprintsInPluginProject(projectId, mockedUser),
      ).rejects.toThrow("Project id is required");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const projectId = "11001";
      const user = mockedUser;
      user.organization.id = "99009900-9156-4c26-9c29-d43cfbe6fff6";
      mocked(pluginService.getSprintsInPluginProject).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getSprintsInPluginProject(projectId, user),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return sprints in the project", async () => {
      const projectId = "11001";
      const sprints = [
        { id: 1, name: "Sprint 1", projectId: "11001" },
        { id: 2, name: "BP Sprint", projectId: "11001" },
      ];
      mocked(pluginService.getSprintsInPluginProject).mockImplementation(() =>
        Promise.resolve(sprints),
      );

      expect(
        pluginService.getSprintsInPluginProject(projectId, mockedUser),
      ).resolves.toStrictEqual(sprints);
    });
  });

  describe("getSprintsFromJiraProject", () => {
    it("should return sprints in the project fetching from jira board", async () => {
      const projectId = "11001";
      const sprints = [
        { id: 1, name: "Sprint 1", projectId: "11001" },
        { id: 2, name: "BP Sprint", projectId: "11001" },
      ];
      mocked(pluginService.getSprintsFromJiraProject).mockImplementation(() =>
        Promise.resolve(sprints),
      );

      expect(
        pluginService.getSprintsFromJiraProject(projectId, mockedUser),
      ).resolves.toStrictEqual(sprints);
    });
  });

  describe("getAllBoardsInJira", () => {
    it("should throw an error invalid plugin credentials", async () => {
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.getAllBoardsInJira).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(pluginService.getAllBoardsInJira(credentials)).rejects.toThrow(
        "Invalid plugin credentials",
      );
    });
    it("should return all boards in user's jira account", async () => {
      const credentials = mockedPluginConfigs[0];
      const boards = [
        { id: 50, name: "Board Quick Test", projectId: "11001" },
        { id: 52, name: "Board service shaft", projectId: "11002" },
        { id: 100, name: "Board 2", projectId: "11003" },
      ];
      mocked(pluginService.getAllBoardsInJira).mockImplementation(() =>
        Promise.resolve(boards),
      );

      expect(
        pluginService.getAllBoardsInJira(credentials),
      ).resolves.toStrictEqual(boards);
    });
  });

  describe("getSprintsInJiraBoard", () => {
    it("should throw an error invalid plugin credentials", async () => {
      const boardId = 50;
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.getSprintsInJiraBoard).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getSprintsInJiraBoard(boardId, credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return sprints by board id", async () => {
      const boardId = 50;
      const credentials = mockedPluginConfigs[0];
      const sprints = [
        { id: 1, name: "Sprint 1", projectId: "11001" },
        { id: 2, name: "BP Sprint", projectId: "11001" },
      ];
      mocked(pluginService.getSprintsInJiraBoard).mockImplementation(() =>
        Promise.resolve(sprints),
      );

      expect(
        pluginService.getSprintsInJiraBoard(boardId, credentials),
      ).resolves.toStrictEqual(sprints);
    });
  });

  describe("addJiraIssue", () => {
    it("should throw an error for project id missing in payload", async () => {
      const payload = {
        summary: "Test Login",
        description: "Login failed with status 400",
        issueTypeId: "34",
        assigneeId: 324242423,
      };
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.addJiraIssue).mockImplementation(() =>
        Promise.reject(new Error("Project id is required")),
      );
      expect(pluginService.addJiraIssue(payload, credentials)).rejects.toThrow(
        "Project id is required",
      );
    });
    it("should throw an error invalid plugin credentials", async () => {
      const payload = {
        projectId: "11001",
        summary: "Test Login",
        description: "Login failed with status 400",
        issueTypeId: "34",
        assigneeId: 324242423,
      };
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.addJiraIssue).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(pluginService.addJiraIssue(payload, credentials)).rejects.toThrow(
        "Invalid plugin credentials",
      );
    });
    it("should return created issue", async () => {
      const payload = {
        projectId: "11001",
        summary: "Test Login",
        description: "Login failed with status 400",
        issueTypeId: "34",
        assigneeId: 324242423,
      };
      const credentials = mockedPluginConfigs[0];
      const issue = {
        id: "10001",
        key: "BP-190",
        projectId: "11001",
        summary: "Test Login",
        description: "Login failed with status 400",
        issueTypeId: "34",
        assigneeId: 324242423,
        sprint: null,
        parentId: null,
      };
      mocked(pluginService.addJiraIssue).mockImplementation(() =>
        Promise.resolve(issue),
      );

      expect(
        pluginService.addJiraIssue(payload, credentials),
      ).resolves.toStrictEqual(issue);
    });
  });

  describe("getJiraSprintCustomField", () => {
    it("should throw an error invalid plugin credentials", async () => {
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.getJiraSprintCustomField).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.getJiraSprintCustomField(credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return null as no sprint field found", async () => {
      const sprintFieldId = null;
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.getJiraSprintCustomField).mockImplementation(() =>
        Promise.resolve(sprintFieldId),
      );

      expect(
        pluginService.getJiraSprintCustomField(credentials),
      ).resolves.toBeNull();
    });
    it("should return sprint custom field id", async () => {
      const sprintFieldId = "customfield_1010";
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.getJiraSprintCustomField).mockImplementation(() =>
        Promise.resolve(sprintFieldId),
      );

      expect(
        pluginService.getJiraSprintCustomField(credentials),
      ).resolves.toEqual(sprintFieldId);
    });
  });

  describe("addCommentInJiraIssue", () => {
    it("should throw an error for issue not found", async () => {
      const issueId = "00000";
      const credentials = mockedPluginConfigs[0];
      const commentDoc = {};
      mocked(pluginService.addCommentInJiraIssue).mockImplementation(() =>
        Promise.reject(new Error("Issue with this id not found")),
      );
      expect(
        pluginService.addCommentInJiraIssue(issueId, commentDoc, credentials),
      ).rejects.toThrow("Issue with this id not found");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const issueId = "11003";
      const credentials = mockedPluginConfigs[0];
      const commentDoc = {};
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.addCommentInJiraIssue).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.addCommentInJiraIssue(issueId, commentDoc, credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return true after adding comment", async () => {
      const issueId = "11003";
      const credentials = mockedPluginConfigs[0];
      const commentDoc = {
        image: "https://sample.image.com/34",
        comment: "Loging test passed after running 10000 data sets",
        status: TestCaseResultStatus.PASSED,
      };
      mocked(pluginService.addCommentInJiraIssue).mockImplementation(() =>
        Promise.resolve(true),
      );

      expect(
        pluginService.addCommentInJiraIssue(issueId, commentDoc, credentials),
      ).resolves.toBeTruthy();
    });
  });

  describe("attachImageInJiraIssue", () => {
    it("should throw an error for issue not found", async () => {
      const imageLink = "https://sample.image.com/34";
      const issueId = "00000";
      const credentials = mockedPluginConfigs[0];
      mocked(pluginService.attachImageInJiraIssue).mockImplementation(() =>
        Promise.reject(new Error("Issue with this id not found")),
      );
      expect(
        pluginService.attachImageInJiraIssue(imageLink, issueId, credentials),
      ).rejects.toThrow("Issue with this id not found");
    });
    it("should throw an error invalid plugin credentials", async () => {
      const imageLink = "https://sample.image.com/34";
      const issueId = "11003";
      const credentials = mockedPluginConfigs[0];
      credentials.accessToken = "incorrectToken";
      mocked(pluginService.attachImageInJiraIssue).mockImplementation(() =>
        Promise.reject(new Error("Invalid plugin credentials")),
      );
      expect(
        pluginService.attachImageInJiraIssue(imageLink, issueId, credentials),
      ).rejects.toThrow("Invalid plugin credentials");
    });
    it("should return attached image details", async () => {
      const imageLink = "https://sample.image.com/34";
      const issueId = "11003";
      const credentials = mockedPluginConfigs[0];
      const res = {
        id: 1001,
        filetype: "image/png",
        filename: "s124.png",
        filesize: 100000,
      };
      mocked(pluginService.attachImageInJiraIssue).mockImplementation(() =>
        Promise.resolve(res),
      );

      expect(
        pluginService.attachImageInJiraIssue(imageLink, issueId, credentials),
      ).resolves.toStrictEqual(res);
    });
  });
});
