import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import axios from "axios";
import * as FormData from "form-data";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../service-users/user/user.entity";
import { AddPluginConfigDto } from "./dto/AddPluginConfigDto";
import { PluginConfigDto } from "./dto/PluginConfigDto";
import { Plugins } from "../../common/enums/plugins";
import { UpdatePluginConfigDto } from "./dto/UpdatePluginConfigDto";
import { PluginConfigEntity } from "./pluginConfig.entity";
import { PluginProjectDto } from "./dto/PluginProjectDto";

@Injectable()
export class PluginService {
  constructor(
    @InjectRepository(PluginConfigEntity)
    private readonly pluginConfigRepository: Repository<PluginConfigEntity>,
  ) {}

  /**
   * Add plugin config of the organization
   */
  async addPluginConfig(
    addPluginConfigDto: AddPluginConfigDto,
    currentLoggedInUser: UserEntity,
  ): Promise<PluginConfigDto> {
    const checkPluginConfig = await this.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (checkPluginConfig?.isIntegrated)
      throw new BadRequestException("translations.DUPLICATE_PLUGIN_CONFIG");

    const verifyPluginCredential = await this.verifyPlugin(addPluginConfigDto);
    if (!verifyPluginCredential)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    let pluginConfig = this.pluginConfigRepository.create();
    pluginConfig.accessToken = addPluginConfigDto.accessToken;
    pluginConfig.plugin = Plugins[addPluginConfigDto.plugin];
    pluginConfig.webAddress = addPluginConfigDto.webAddress;
    pluginConfig.userName = addPluginConfigDto.userName;
    pluginConfig.organization = currentLoggedInUser.organization;
    pluginConfig.isIntegrated = true;
    pluginConfig = await this.pluginConfigRepository.save(pluginConfig);
    return pluginConfig?.toDto();
  }

  /**
   * Get jira plugin config by organization id
   */
  async getJiraPluginConfigByOrgId(
    organizationId: string,
  ): Promise<PluginConfigEntity> {
    const pluginConfig = await this.pluginConfigRepository
      .createQueryBuilder("pluginConfig")
      .innerJoinAndSelect(
        "pluginConfig.organization",
        "organization",
        "organization.id = :id",
        { id: organizationId },
      )
      .where("pluginConfig.plugin = :plugin", { plugin: Plugins.JIRA })
      .andWhere("pluginConfig.isIntegrated = :check", { check: true })
      .getOne();
    return pluginConfig;
  }

  /**
   * Get plugin config by id
   */
  async getPluginConfigById(id: string): Promise<PluginConfigEntity> {
    const pluginConfig = await this.pluginConfigRepository
      .createQueryBuilder("pluginConfig")
      .leftJoinAndSelect("pluginConfig.organization", "organization")
      .where("pluginConfig.id = :id", { id })
      .getOne();
    return pluginConfig;
  }

  /**
   * Verify plugin with user provided credentials
   */
  async verifyPlugin(credentials) {
    if (!credentials?.plugin) return false;
    credentials.plugin = credentials.plugin.toUpperCase();
    if (credentials.plugin === Plugins.JIRA) {
      return this.verifyJiraPlugin(credentials);
    }
    return false;
  }

  /**
   * Verify Jira plugin with user provided credentials
   */
  async verifyJiraPlugin(credentials) {
    const { accessToken, webAddress, userName } = credentials;
    if (!(accessToken && webAddress && userName)) return false;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    try {
      const response = await axios.get(`${webAddress}rest/agile/latest/board`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          Accept: "application/json",
        },
      });
      if (response.status === HttpStatus.OK) return true;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Update plugin config of the organization
   */
  async updatePluginConfig(
    id: string,
    updatePluginConfigDto: UpdatePluginConfigDto,
    currentLoggedInUser: UserEntity,
  ): Promise<PluginConfigDto> {
    const checkPluginConfig = await this.getPluginConfigById(id);
    if (!checkPluginConfig)
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    if (
      checkPluginConfig?.organization?.id !==
      currentLoggedInUser?.organization?.id
    ) {
      throw new ForbiddenException("translations.ACCESS_DENIED");
    }

    if (updatePluginConfigDto.accessToken)
      checkPluginConfig.accessToken = updatePluginConfigDto.accessToken;
    if (updatePluginConfigDto.webAddress)
      checkPluginConfig.webAddress = updatePluginConfigDto.webAddress;
    if (updatePluginConfigDto.userName)
      checkPluginConfig.userName = updatePluginConfigDto.userName;

    const verifyPluginCredential = await this.verifyPlugin(checkPluginConfig);
    if (!verifyPluginCredential)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    const updatedPluginConfig =
      await this.pluginConfigRepository.save(checkPluginConfig);
    return updatedPluginConfig?.toDto();
  }

  /**
   * Get list of projects in plugin
   */
  async getPluginProjects(currentLoggedInUser: UserEntity): Promise<any> {
    const pluginConfig = await this.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!pluginConfig?.isIntegrated)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    const projectList: PluginProjectDto[] = [];
    const response = await this.getJiraProjectList(pluginConfig);
    response?.values?.forEach((project) => {
      projectList.push(new PluginProjectDto(project));
    });
    return projectList;
  }

  /**
   * Get list of projects in jira
   */
  async getJiraProjectList(credentials: PluginConfigEntity) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    const max = 100;
    try {
      const response = await axios.get(
        `${webAddress}rest/api/3/project/search?maxResults=${max}&field=id,key`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
          },
        },
      );
      if (response.status === HttpStatus.OK) return response?.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Get issue keys in plugin project
   */
  async getAllIssueKeysInPluginProject(
    projectKey: string,
    subtask: boolean,
    currentLoggedInUser: UserEntity,
  ): Promise<any> {
    if (!projectKey)
      throw new BadRequestException("translations.PROJECT_KEY_REQUIRED");

    const pluginConfig = await this.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!pluginConfig?.isIntegrated)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    const response = await this.getJiraIssueKeysByProjectKey(
      projectKey,
      pluginConfig,
    );
    const issues: any = [];
    response?.issues?.forEach((issue) => {
      if (subtask || !issue?.fields?.parent)
        issues.push({ key: issue?.key, id: issue?.id });
    });
    return { issues };
  }

  /**
   * Get jira issue keys by project key
   */
  async getJiraIssueKeysByProjectKey(
    projectKey: string,
    credentials: PluginConfigEntity,
  ) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    const max = 1000;
    const bodyData = {
      jql: `project = ${projectKey}`,
      maxResults: max,
      startAt: 0,
      fields: ["parent"],
    };
    try {
      const response = await axios.post(
        `${webAddress}rest/api/latest/search`,
        bodyData,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === HttpStatus.OK) return response?.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Get issue types in plugin project
   */
  async getAllIssueTypesInPluginProject(
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<any> {
    if (!projectId)
      throw new BadRequestException("translations.PROJECT_ID_REQUIRED");

    const pluginConfig = await this.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!pluginConfig?.isIntegrated)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    return this.getJiraIssueTypesByProjecId(projectId, pluginConfig);
  }

  /**
   * Get jira issue types by project id
   */
  async getJiraIssueTypesByProjecId(
    projectId: string,
    credentials: PluginConfigEntity,
  ) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    try {
      const response = await axios.get(
        `${webAddress}rest/api/3/issuetype/project?projectId=${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
          },
        },
      );
      if (response.status === HttpStatus.OK) return response?.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Get users assignable to a plugin project
   */
  async getAllUsersInPluginProject(
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<any> {
    if (!projectId)
      throw new BadRequestException("translations.PROJECT_ID_REQUIRED");

    const pluginConfig = await this.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!pluginConfig?.isIntegrated)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    return this.getAllUsersInJiraProject(projectId, pluginConfig);
  }

  /**
   * Get users assignable to jira project
   */
  async getAllUsersInJiraProject(
    projectId: string,
    credentials: PluginConfigEntity,
  ) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    const max = 1000;
    try {
      const response = await axios.get(
        `${webAddress}rest/api/3/user/assignable/search?project=${projectId}&maxResults=${max}`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
          },
        },
      );
      if (response.status === HttpStatus.OK) return response?.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException("translations.RECORD_NOT_FOUND");
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Get sprints of the plugin project
   */
  async getSprintsInPluginProject(
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<any> {
    if (!projectId)
      throw new BadRequestException("translations.PROJECT_ID_REQUIRED");

    const pluginConfig = await this.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!pluginConfig?.isIntegrated)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    return this.getSprintsFromJiraProject(projectId, pluginConfig);
  }

  /**
   * Get sprints from jira project
   */
  async getSprintsFromJiraProject(
    projectId: string,
    credentials: PluginConfigEntity,
  ) {
    const sprints = [];
    const sprintIds = new Map();
    const boardIds = [];
    const parsedProjectId = Number(projectId);
    const boards = await this.getAllBoardsInJira(credentials);
    boards?.values?.forEach((board) => {
      if (board?.location?.projectId === parsedProjectId)
        boardIds.push(board.id);
    });
    if (boardIds.length) {
      for (const id of boardIds) {
        const response = await this.getSprintsInJiraBoard(id, credentials);
        response?.values?.forEach((sprint) => {
          if (!sprintIds.has(sprint.id)) {
            sprintIds.set(sprint.id, true);
            sprints.push(sprint);
          }
        });
      }
    }
    return sprints;
  }

  /**
   * Get all boards in jira
   */
  async getAllBoardsInJira(credentials: PluginConfigEntity) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    try {
      const response = await axios.get(`${webAddress}rest/agile/latest/board`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          Accept: "application/json",
        },
      });
      if (response.status === HttpStatus.OK) return response?.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Get sprints by board id
   */
  async getSprintsInJiraBoard(boardId, credentials: PluginConfigEntity) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    try {
      const response = await axios.get(
        `${webAddress}rest/agile/latest/board/${boardId}/sprint`,
        {
          method: "GET",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
          },
        },
      );
      if (response.status === HttpStatus.OK) return response?.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Create new jira issue
   */
  async addJiraIssue(payload, credentials) {
    const bodyData = await this.setCreateJiraIssuePayload(payload, credentials);
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    let message = null;
    try {
      const response = await axios.post(
        `${webAddress}rest/api/latest/issue`,
        bodyData,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      if (response.status === HttpStatus.CREATED) return response?.data;
    } catch (error) {
      const errorData = error?.response?.data;
      status = error?.response?.status;
      if (errorData?.errorMessages?.length) {
        message = errorData.errorMessages[0];
      } else if (errorData?.errors)
        message = Object.values(errorData?.errors)[0];
    }
    if (status && status === HttpStatus.BAD_REQUEST) {
      throw new BadRequestException(message);
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Find custom field id of the sprint
   */
  async getJiraSprintCustomField(credentials) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    try {
      const response = await axios.get(`${webAddress}rest/api/latest/field`, {
        method: "GET",
        headers: {
          Authorization: `Basic ${authHeader}`,
          Accept: "application/json",
        },
      });
      const fields = response?.data;
      if (!fields) return null;
      for (const field of fields)
        if (field?.name?.toLowerCase() === "sprint") return field.id;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Set payload for create jira issue
   */
  async setCreateJiraIssuePayload(payload, credentials) {
    const fields: any = {};
    if (payload?.title) fields.summary = payload.title;
    if (payload?.projectId) fields.project = { id: payload.projectId };
    if (payload?.issueTypeId) fields.issuetype = { id: payload.issueTypeId };
    if (payload?.assigneeId) fields.assignee = { id: payload.assigneeId };
    // if issue type is subtask, parent id is required
    if (payload?.parentId) fields.parent = { id: payload.parentId };
    // subtask cannot be associated to a sprint
    if (!payload?.parentId && payload?.sprintId) {
      const sprintCustomField =
        await this.getJiraSprintCustomField(credentials);
      if (sprintCustomField && Number(payload.sprintId))
        fields[sprintCustomField] = Number(payload.sprintId);
    }
    if (payload?.description) fields.description = payload.description;
    return { fields };
  }

  /**
   * Add comment in jira issue
   */
  async addCommentInJiraIssue(issueId: string, commentDoc, credentials) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    if (commentDoc?.image) {
      const res = await this.attachImageInJiraIssue(
        commentDoc.image,
        issueId,
        credentials,
      );
      commentDoc.imageId = res?.length ? res[0].id : null;
      commentDoc.imageName = res?.length ? res[0].filename : null;
    }
    const bodyData = await this.setAddCommentJiraIssuePayload(
      commentDoc,
      credentials,
    );
    try {
      const response = await axios.post(
        `${webAddress}rest/api/latest/issue/${issueId}/comment`,
        bodyData,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        },
      );
      if (response?.status === HttpStatus.CREATED) return true;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException("translations.ISSUE_NOT_FOUND");
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  async downloadFile(fileUrl: string): Promise<any> {
    const response = await axios.get(fileUrl, { responseType: "stream" });
    return response.data;
  }

  /**
   * Attach image with jira issue
   */
  async attachImageInJiraIssue(
    imageLink: string,
    issueId: string,
    credentials,
  ) {
    // conver file to multipart/form-data
    const file = await this.downloadFile(imageLink);
    const form = new FormData();
    form.append("file", file);
    let status = null;
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    const headers = form.getHeaders();
    headers.Authorization = `Basic ${authHeader}`;
    headers.Accept = "application/json";
    headers["X-Atlassian-Token"] = "no-check";
    try {
      const response = await axios.post(
        `${webAddress}rest/api/2/issue/${issueId}/attachments`,
        form,
        {
          method: "POST",
          headers,
        },
      );
      if (response?.status === HttpStatus.OK) return response.data;
    } catch (error) {
      status = error?.response?.status;
    }
    if (status && status === HttpStatus.NOT_FOUND) {
      throw new NotFoundException("translations.ISSUE_NOT_FOUND");
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Set payload for add comment in jira issue
   */
  async setAddCommentJiraIssuePayload(payload, credentials) {
    let comment = "";
    let image = "";
    if (payload?.comment) comment = `Comment: ${payload.comment}`;
    if (payload?.imageId && payload?.imageName) {
      image = `Attached Image:  !${credentials.webAddress}/secure/attachment/${payload.imageId}/${payload.imageName}!`;
    }
    const body = `Tester: ${payload.tester}
            Tester email: ${payload.testerEmail}
            Status: ${payload.status}
            ${comment} 
            ${image}
        `;
    return { body };
  }
}
