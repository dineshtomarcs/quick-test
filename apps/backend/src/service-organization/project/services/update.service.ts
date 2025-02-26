import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpectationFailedException } from "../../../exceptions/expectation-failed.exception";
import { AwsS3Service } from "../../../shared/services/aws-s3.service";
import { ValidatorService } from "../../../shared/services/validator.service";
import { ProjectEntity } from "../project.entity";
import { EditProjectDto } from "../dto/EditProjectDto";
import { UserEntity } from "../../../service-users/user/user.entity";
import { UtilsService } from "../../../_helpers/utils.service";
import { ProjectDetailsDto } from "../dto/ProjectDetailsDto";
import { TestCaseDto } from "../../test-case/dto/TestCaseDto";

import { TestCaseService } from "../../test-case/test-case.service";

import { TestCaseResultService } from "../../test-suite/test-case-result/test-case-result.service";
import { EditTestCaseDto } from "../../test-case/dto/EditTestCaseDto";

import { TestSuiteService } from "../../test-suite/test-suite.service";
import { EditTestSuiteDto } from "../../test-suite/dto/EditTestSuiteDto";
import { EditSectionDto } from "../../test-case/section/dto/EditSectionDto";
import { SectionEntity } from "../../test-case/section/section.entity";

import { SectionService } from "../../test-case/section/section.service";

import { MilestoneService } from "../../milestone/milestone.service";

import { ActivityService } from "../activity/activity.service";
import { ProjectDto } from "../dto/ProjectDto";

import { ProjectFavoriteDetailDto } from "../dto/ProjectFavoriteDetailDto";
import { UserCreateService } from "../../../service-users/user/services/create.service";
import { UserDeleteService } from "../../../service-users/user/services/delete.service";
import { UserReadService } from "../../../service-users/user/services/read.service";
import { ProjectReadService } from "./read.service";

@Injectable()
export class ProjectUpdateService {
  public userReadService: UserReadService;

  public userDeleteService: UserDeleteService;

  public userCreateService: UserCreateService;

  public projectReadService: ProjectReadService;

  public milestoneService: MilestoneService;

  public activityService: ActivityService;

  public testCaseService: TestCaseService;

  public sectionService: SectionService;

  public testSuiteService: TestSuiteService;

  constructor(
    @InjectRepository(ProjectEntity)
    public readonly projectRepository: Repository<ProjectEntity>,
    public readonly validatorService: ValidatorService,
    public readonly awsS3Service: AwsS3Service,
    public readonly moduleRef: ModuleRef,
    public readonly testCaseResultService: TestCaseResultService,
  ) {}

  onModuleInit(): void {
    this.activityService = this.moduleRef.get(ActivityService, {
      strict: false,
    });
    this.testCaseService = this.moduleRef.get(TestCaseService, {
      strict: false,
    });
    this.sectionService = this.moduleRef.get(SectionService, {
      strict: false,
    });
    this.testSuiteService = this.moduleRef.get(TestSuiteService, {
      strict: false,
    });
    this.milestoneService = this.moduleRef.get(MilestoneService, {
      strict: false,
    });
    this.userCreateService = this.moduleRef.get(UserCreateService, {
      strict: false,
    });
    this.userReadService = this.moduleRef.get(UserReadService, {
      strict: false,
    });
    this.userDeleteService = this.moduleRef.get(UserDeleteService, {
      strict: false,
    });
    this.projectReadService = this.moduleRef.get(ProjectReadService, {
      strict: false,
    });
  }

  /**
   * Edit project
   */

  async editProject(
    editProjectDto: EditProjectDto,
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<ProjectDetailsDto> {
    const project = await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.organization", "organization")
      .where("project.id = :projectId", { projectId })
      .getOne();
    if (!project) throw new NotFoundException("translations.RECORD_NOT_FOUND");
    if (project.organization?.id !== currentLoggedInUser?.organization?.id) {
      throw new ForbiddenException("translations.ACCESS_DENIED");
    }
    if (editProjectDto.name) {
      project.name = UtilsService.titleCase(editProjectDto.name);
      await this.projectReadService.checkProjectWithSameName(
        project.name,
        project.organization.id,
      );
    }
    if (editProjectDto.description) {
      project.description = editProjectDto.description;
    }
    const projectData = await this.projectRepository.save(project);
    return new ProjectDetailsDto(projectData);
  }

  /**
   * Edit Test case
   */
  async editTestCase(
    editTestCaseDto: EditTestCaseDto,
    testCaseId: string,
    projectId: string,
    sectionId: string,
    currentLoggerInUser: UserEntity,
  ): Promise<TestCaseDto> {
    const project = await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggerInUser.organization.id,
    );
    return this.testCaseService.editTestCase(
      editTestCaseDto,
      testCaseId,
      project,
      sectionId,
      currentLoggerInUser,
    );
  }

  /**
   * Edit Multiple Test cases
   */
  async editMultipleTestCases(
    editTestCaseDto: EditTestCaseDto,
    testCaseIds: string[],
    projectId: string,
    sectionId: string,
    currentLoggerInUser: UserEntity,
  ): Promise<boolean> {
    const project = await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggerInUser.organization.id,
    );
    return this.testCaseService.editMultipleTestCases(
      editTestCaseDto,
      testCaseIds,
      project,
      sectionId,
      currentLoggerInUser,
    );
  }

  /**
   * Edit a test suite
   */

  async editTestSuite(
    editTestSuiteDto: EditTestSuiteDto,
    testSuiteId: string,
    projectId: string,
    currentLoggerInUser: UserEntity,
  ): Promise<any> {
    await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggerInUser.organization.id,
    );
    const testSuite = await this.testSuiteService.editTestSuite(
      editTestSuiteDto,
      testSuiteId,
      currentLoggerInUser,
    );
    const { user, assignedTo, milestoneId, ...rest } = testSuite.toDto();
    const result = {
      ...rest,
      user: { ...user?.toDto() },
      assignedTo: { ...assignedTo?.toDto() },
      milestoneId: { ...milestoneId?.toDto() },
    };
    return result;
  }

  /**
   * Edit section for project
   */
  async editSection(
    editSectionDto: EditSectionDto,
    sectionId: string,
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<SectionEntity> {
    const project = await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.organization", "organization")
      .leftJoinAndSelect(
        "project.sections",
        "section",
        "section.id = :sectionId",
        {
          sectionId,
        },
      )
      .where("project.id = :projectId", {
        projectId,
      })
      .andWhere("organization.id = :id", {
        id: currentLoggedInUser.organization?.id,
      })
      .getOne();
    if (!project) throw new NotFoundException("translations.RECORD_NOT_FOUND");
    const section = await this.sectionService.editSection(
      editSectionDto,
      project.sections?.length ? project.sections[0] : null,
      project,
    );
    return section;
  }

  async reOrderTestCaseRequest(
    sectionId: string,
    testCaseId: string,
    newPosition: number,
  ): Promise<boolean> {
    const reOderAttempt = this.sectionService.reOrderPriorities(
      sectionId,
      testCaseId,
      newPosition,
    );
    if (reOderAttempt) {
      return reOderAttempt;
    }
    throw new ExpectationFailedException("translations.REORDER_FAILED");
  }

  /**
   * Internal method to mark which projects are favorite
   * for current logged in user
   */
  async markFavoriteProject(
    projects: ProjectEntity[],
    currentLoggedInUser: UserEntity,
  ): Promise<ProjectFavoriteDetailDto[]> {
    const favoriteProjects =
      await this.projectReadService.getFavoriteProjects(currentLoggedInUser);

    return projects.map((project) => {
      const isFavorite = favoriteProjects.some(
        (favoriteProject) => favoriteProject.id === project.id,
      );
      return new ProjectFavoriteDetailDto(project, isFavorite);
    });
  }

  /** *******Restore project****** */

  async restoreProject(projectId: string): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne({
      //relations: ["testcases", "testsuites", "sections", "activities", "milestones"],
      where: {
        id: projectId,
      },
      withDeleted: true,
    });
    if (!project) throw new NotFoundException("translations.RECORD_NOT_FOUND");
    await this.projectRepository.recover(project);
    project.archivedBy = null;
    await this.projectRepository.save(project);
    return project.toDto();
  }
}
