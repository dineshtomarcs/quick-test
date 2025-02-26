import {
  Injectable,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import axios from "axios";
import { ModuleRef } from "@nestjs/core";

import { ExpectationFailedException } from "../../exceptions/expectation-failed.exception";
import { UserEntity } from "../../service-users/user/user.entity";
import { DefectRepository } from "./defect.repository";
import { DefectDto } from "./dto/DefectDto";
import { UpdateDefectRefDto } from "./dto/UpdateDefectRefDto";
import { DefectEntity } from "./defect.entity";
import { PluginService } from "../plugin/plugin.service";
import { Plugins } from "../../common/enums/plugins";
import { TestCaseService } from "../test-case/test-case.service";
import { PluginConfigEntity } from "../plugin/pluginConfig.entity";
import { AddDefectDto } from "./dto/AddDefectDto";

@Injectable()
export class DefectService {
  public testCaseService: TestCaseService;

  public pluginService: PluginService;

  constructor(
    private readonly defectRepository: DefectRepository,
    public readonly moduleRef: ModuleRef,
  ) {}

  onModuleInit(): void {
    this.testCaseService = this.moduleRef.get(TestCaseService, {
      strict: false,
    });
    this.pluginService = this.moduleRef.get(PluginService, {
      strict: false,
    });
  }

  /**
   * Create new defect
   */
  async createDefect(
    pluginKey: string,
    pluginId: string,
    pluginConfig: PluginConfigEntity,
  ): Promise<DefectEntity> {
    let defect = this.defectRepository.create();
    defect.pluginId = pluginId;
    defect.pluginKey = pluginKey;
    defect.pluginConfig = pluginConfig;
    defect = await this.defectRepository.save(defect);
    return defect;
  }

  /**
   * Update defects reference in testcase
   */
  async updateDefectRefInTestCase(
    testCaseId: string,
    updateDefectRefDto: UpdateDefectRefDto,
    currentLoggedInUser: UserEntity,
  ): Promise<DefectDto> {
    let defect = await this.getDefectByKeyAndTestcaseId(
      updateDefectRefDto.pluginKey,
      testCaseId,
    );
    if (defect) return defect.toDto();

    const pluginConfig = await this.pluginService.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!pluginConfig)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");

    const issue: any = await this.getIssueDetailsByKey(
      updateDefectRefDto?.pluginKey,
      pluginConfig,
    );
    defect = await this.createDefect(
      updateDefectRefDto.pluginKey,
      issue?.id,
      pluginConfig,
    );
    const response = await this.testCaseService.addJiraReference(
      defect,
      testCaseId,
      currentLoggedInUser?.organization?.id,
    );
    if (response) return defect?.toDto();
    throw new ExpectationFailedException("translations.ACTION_FAILED");
  }

  /**
   * Get defect by key and testcase id
   */
  async getDefectByKeyAndTestcaseId(
    pluginKey: string,
    testCaseId: string,
  ): Promise<DefectEntity> {
    const defect = await this.defectRepository
      .createQueryBuilder("defect")
      .innerJoinAndSelect("defect.testcases", "testcase", "testcase.id = :id", {
        id: testCaseId,
      })
      .where("defect.pluginKey = :key", { key: pluginKey })
      .getOne();
    return defect;
  }

  async getIssueDetailsByKey(pluginKey: string, credentials) {
    if (credentials?.plugin && credentials.plugin === Plugins.JIRA) {
      return this.getJiraIssueByKey(pluginKey, credentials);
    }
  }

  async getJiraIssueByKey(pluginKey: string, credentials) {
    const { accessToken, webAddress, userName } = credentials;
    const authHeader = Buffer.from(`${userName}:${accessToken}`).toString(
      "base64",
    );
    let status = null;
    try {
      const response = await axios.get(
        `${webAddress}rest/api/3/issue/${pluginKey}`,
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
      throw new NotFoundException("translations.ISSUE_NOT_FOUND");
    }
    if (status && status === HttpStatus.UNAUTHORIZED) {
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    }
  }

  /**
   * Push new defect to the plugin
   */
  async addDefect(addDefectDto: AddDefectDto, currentLoggedInUser: UserEntity) {
    const credentials = await this.pluginService.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!credentials)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    const issue = await this.pluginService.addJiraIssue(
      addDefectDto,
      credentials,
    );
    if (issue?.key && addDefectDto?.testCaseId) {
      await this.updateDefectRefInTestCase(
        addDefectDto.testCaseId,
        { pluginKey: issue.key },
        currentLoggedInUser,
      );
    }
    return issue;
  }

  /**
   * Add comment to the defect
   */
  async addDefectComment(
    defect: DefectEntity,
    commentDoc,
    currentLoggedInUser: UserEntity,
  ) {
    const credentials = await this.pluginService.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    const checkCommentDoc =
      commentDoc?.status || commentDoc?.comment || commentDoc?.image;
    const checkDefect = defect?.id && defect?.pluginId;
    if (credentials && checkCommentDoc && checkDefect) {
      commentDoc.testerEmail = currentLoggedInUser.email;
      commentDoc.tester = currentLoggedInUser.firstName;
      if (currentLoggedInUser.lastName)
        commentDoc.tester += ` ${currentLoggedInUser.lastName}`;
      await this.pluginService.addCommentInJiraIssue(
        defect.pluginId,
        commentDoc,
        credentials,
      );
    }
  }

  /**
   * Get defect details
   */
  async getDefectDetails(id: string, currentLoggedInUser: UserEntity) {
    const credentials = await this.pluginService.getJiraPluginConfigByOrgId(
      currentLoggedInUser?.organization?.id,
    );
    if (!credentials)
      throw new BadRequestException("translations.INVALID_PLUGIN_CREDENTIALS");
    const issue = await this.getIssueDetailsByKey(id, credentials);
    if (issue) {
      const description = this.findDescriptionsInIssue(issue);
      const sprint = this.findSprintsInIssue(issue);
      let parent: any = {};
      if (issue?.fields?.parent) {
        parent.id = issue?.fields?.parent?.id;
        parent.key = issue?.fields?.parent?.key;
        parent.self = `${credentials.webAddress}browse/${parent.key}`;
      } else parent = null;
      return {
        self: `${credentials.webAddress}browse/${issue.key}`,
        issueId: issue?.id,
        issueKey: issue?.key,
        project: issue?.fields?.project,
        issueType: issue?.fields?.issuetype,
        assignee: issue?.fields?.assignee,
        priority: issue?.fields?.priority,
        description,
        sprint,
        parent,
        summary: issue?.fields?.summary,
      };
    }
  }

  /**
   * Internal method to find text type descriptions in issue
   */
  findDescriptionsInIssue(issue): string {
    let description = "";
    issue?.fields?.description?.content?.forEach((obj) => {
      if (obj?.type === "paragraph") {
        obj.content.forEach((i) => {
          if (i.type === "text" && i?.text) description += `${i?.text}\n`;
        });
      }
    });
    return description;
  }

  /**
   * Internal method to find sprints in issue
   */
  findSprintsInIssue(issue) {
    if (!issue?.fields) return null;
    const customFields = [];
    for (const key in issue.fields) {
      if (key.length > 11 && key.substring(0, 11) === "customfield") {
        customFields.push(issue?.fields[key]);
      }
    }
    for (const field of customFields) {
      if (
        Array.isArray(field) &&
        field.length > 0 &&
        field[0]?.id &&
        field[0]?.boardId
      ) {
        return field;
      }
    }
  }
}
