import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ExpectationFailedException } from "../../../exceptions/expectation-failed.exception";
import { AwsS3Service } from "../../../shared/services/aws-s3.service";
import { ValidatorService } from "../../../shared/services/validator.service";
import { CreateProjectDto } from "../dto/CreateProjectDto";
import { UserEntity } from "../../../service-users/user/user.entity";
import { UtilsService } from "../../../_helpers/utils.service";
import { ProjectDetailsDto } from "../dto/ProjectDetailsDto";
import { TestCaseDto } from "../../test-case/dto/TestCaseDto";
import { TestCaseService } from "../../test-case/test-case.service";
import { TestCaseResultService } from "../../test-suite/test-case-result/test-case-result.service";
import { CreateTestCaseDto } from "../../test-case/dto/CreateTestCaseDto";
import { CreateTestSuiteDto } from "../../test-suite/dto/CreateTestSuiteDto";
import { TestSuiteDto } from "../../test-suite/dto/TestSuiteDto";
import { TestSuiteService } from "../../test-suite/test-suite.service";
import { CreateSectionDto } from "../../test-case/section/dto/CreateSectionDto";
import { SectionEntity } from "../../test-case/section/section.entity";
import { SectionService } from "../../test-case/section/section.service";
import { CreateMilestoneDto } from "../../milestone/dto/CreateMilestoneDto";
import { MilestoneService } from "../../milestone/milestone.service";
import { ActivityService } from "../activity/activity.service";
import { MostActiveProjectDto } from "../dto/MostActiveProjectDto";
import { MostActiveProjectListDto } from "../dto/MostActiveProjectListDto";
import { CreateFilteredTestSuiteDto } from "../../test-suite/dto/CreateFilteredTestSuiteDto";
import { IFile } from "../../../interfaces/IFile";
import { UserCreateService } from "../../../service-users/user/services/create.service";
import { UserDeleteService } from "../../../service-users/user/services/delete.service";
import { UserReadService } from "../../../service-users/user/services/read.service";
import { ProjectReadService } from "./read.service";
import { ProjectEntity } from "../project.entity";

@Injectable()
export class ProjectCreateService {
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
    this.userCreateService = this.moduleRef.get(UserCreateService, {
      strict: false,
    });
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
   * Create a project
   */

  async createProject(
    createProjectDto: CreateProjectDto,
    user: UserEntity,
  ): Promise<ProjectDetailsDto> {
    createProjectDto.name = UtilsService.titleCase(createProjectDto.name);
    await this.projectReadService.checkProjectWithSameName(
      createProjectDto.name,
      user.organization.id,
    );
    const project = this.projectRepository.create(createProjectDto);
    project.organization = user.organization;
    const projectData = await this.projectRepository.save(project);
    await this.sectionService.addDefaultSection(
      {
        name: "Unassigned",
        description: "Default section",
      },
      projectData,
    );
    return new ProjectDetailsDto(projectData);
  }

  /**
   * Create a Test case
   */

  async createTestCase(
    createTestCaseDto: CreateTestCaseDto,
    projectId: string,
    sectionId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<TestCaseDto> {
    const project = await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggedInUser.organization.id,
    );
    const testCase = await this.testCaseService.createTestCase(
      createTestCaseDto,
      project,
      sectionId,
      currentLoggedInUser,
      projectId,
    );
    return testCase.toDto();
  }

  /**
   * Create a test suite
   */

  async createTestSuite(
    createTestSuiteDto: CreateTestSuiteDto,
    projectId: string,
    currentLoggerInUser: UserEntity,
  ): Promise<TestSuiteDto> {
    const project = await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggerInUser.organization.id,
    );
    const testSuite = await this.testSuiteService.createTestSuite(
      createTestSuiteDto,
      project,
      currentLoggerInUser,
    );
    return testSuite.toDto();
  }

  /**
   * Create a test suite with filtered sections and test cases
   */
  async createFilteredTestSuite(
    createFilteredTestSuiteDto: CreateFilteredTestSuiteDto,
    projectId: string,
    currentLoggerInUser: UserEntity,
  ): Promise<any> {
    const project = await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggerInUser.organization.id,
    );
    const testSuite = await this.testSuiteService.createFilteredTestSuite(
      createFilteredTestSuiteDto,
      project,
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
   * Add new section for project
   */
  async addSection(
    createSectionDto: CreateSectionDto,
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<SectionEntity> {
    createSectionDto.name = UtilsService.titleCase(createSectionDto.name);
    const project = await this.projectRepository
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.organization", "organization")
      .leftJoinAndSelect(
        "project.sections",
        "section",
        "section.name = :name",
        {
          name: createSectionDto.name,
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
    const section = await this.sectionService.addSection(
      createSectionDto,
      project,
    );
    return section;
  }

  /**
   * Create a Milestone
   */

  async createMilestone(
    createMilestoneDto: CreateMilestoneDto,
    projectId: string,
    currentLoggerInUser: UserEntity,
  ): Promise<CreateMilestoneDto> {
    const project = await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggerInUser.organization.id,
    );
    const milestone = await this.milestoneService.createMilestone(
      createMilestoneDto,
      project,
      currentLoggerInUser,
    );
    return milestone.toDto();
  }

  /**
   *  Internal method to add inactive projects with 0 test changes
   *  to active project list
   */
  addInactiveProjects(
    projects: MostActiveProjectDto[],
    activeProjectsList: MostActiveProjectListDto,
  ): MostActiveProjectListDto {
    const newActiveProjects = activeProjectsList.projects;

    projects.forEach((project) => {
      const checkProjectExist = newActiveProjects.find(
        (activeProject) => activeProject.id === project.id,
      );
      if (!checkProjectExist) {
        project.totalTestChanges = 0;
        newActiveProjects.push(project);
      }
    });
    return new MostActiveProjectListDto(
      activeProjectsList.date,
      newActiveProjects,
    );
  }

  /**
   * Add favorite project for user
   */
  async addFavoriteProject(
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<boolean> {
    await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggedInUser.organization.id,
    );
    await this.userCreateService.createFavoriteProject(
      projectId,
      currentLoggedInUser,
    );
    return true;
  }

  /**
   * Add pdf of selected test cases
   */
  async addTestCasesPdf(
    projectId: string,
    testCaseIds: string[],
    currentLoggedInUser: UserEntity,
  ): Promise<string> {
    await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggedInUser.organization.id,
    );
    const project = await this.projectReadService.findOne({
      id: projectId,
    });
    const pdfLink = await this.testCaseService.addTestCasesPdf(
      project,
      testCaseIds,
    );
    return pdfLink;
  }

  /**
   * Add pdf of selected test suites
   */
  async addTestSuitesPdf(
    projectId: string,
    testSuiteIds: string[],
    currentLoggedInUser: UserEntity,
  ): Promise<string> {
    await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggedInUser.organization.id,
    );
    const project = await this.projectReadService.findOne({
      id: projectId,
    });
    const pdfLink = await this.testSuiteService.addTestSuitesPdf(
      project,
      testSuiteIds,
    );
    return pdfLink;
  }

  /**
   * Add pdf of test suite result
   */
  async addTestSuiteResultPdf(
    projectId: string,
    testSuiteId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<string> {
    await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggedInUser.organization.id,
    );
    const project = await this.projectReadService.findOne({
      id: projectId,
    });
    const pdfLink = await this.testSuiteService.addTestSuiteResultPdf(
      project,
      testSuiteId,
    );
    return pdfLink;
  }

  /**
   * Upload image for a project
   */
  async uploadProjectImage(file: IFile): Promise<string> {
    if (!file) throw new BadRequestException("translations.FILE_REQUIRED");
    const checkImageType = this.validatorService.isImage(file?.mimetype);
    if (!checkImageType)
      throw new BadRequestException("translations.INVALID_IMAGE_TYPE");

    const key = await this.awsS3Service.uploadImage(file);
    if (!key || !key?.Location)
      throw new ExpectationFailedException("translations.ACTION_FAILED");

    return key.Location;
  }
}
