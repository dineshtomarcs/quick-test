import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, DataSource } from "typeorm";
import { AwsS3Service } from "../../../shared/services/aws-s3.service";
import { ValidatorService } from "../../../shared/services/validator.service";
import { UserEntity } from "../../../service-users/user/user.entity";
import { TestCaseService } from "../../test-case/test-case.service";
import { TestCaseResultService } from "../../test-suite/test-case-result/test-case-result.service";
import { TestSuiteService } from "../../test-suite/test-suite.service";
import { SectionService } from "../../test-case/section/section.service";
import { MilestoneService } from "../../milestone/milestone.service";
import { ActivityService } from "../activity/activity.service";
import { UserCreateService } from "../../../service-users/user/services/create.service";
import { UserDeleteService } from "../../../service-users/user/services/delete.service";
import { UserReadService } from "../../../service-users/user/services/read.service";
import { ProjectReadService } from "./read.service";
import { ProjectDto } from "../dto/ProjectDto";
import { ProjectEntity } from "../project.entity";

@Injectable()
export class ProjectDeleteService {
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
    private dataSource: DataSource,
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
   * Archieve a project
   */

  async archiveProject(
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<ProjectDto> {
    const project = await this.projectRepository.findOne({
      //relations: ["testcases", "testsuites", "sections", "milestones", "activities"],
      where: {
        id: projectId,
      },
    });
    if (!project) throw new NotFoundException("translations.RECORD_NOT_FOUND");
    await this.userDeleteService.deleteFavoriteProject(
      project.id,
      currentLoggedInUser,
    );
    project.archivedBy = currentLoggedInUser;
    await this.projectRepository.save(project);
    await this.projectRepository.softRemove(project);
    return project.toDto();
  }

  /**
   * Delete a project
   */

  async deleteProject(projectId: string): Promise<boolean> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      withDeleted: true,
    });

    if (!project) throw new NotFoundException("translations.RECORD_NOT_FOUND");

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      await queryRunner.startTransaction();
      /**
       * order of deleting projects related
       * activities  || project_id
       * testreports || test_suite_id
       * test_case_results || test_suite_id
       * testsuites || project_id
       * testcases || project_id
       * milestones || project_id
       * sections || project_id
       * user_favorite_projects || project_id
       * user_assigned as project_member || project_id
       * projects || id
       */

      await queryRunner.query(
        `DELETE FROM activities WHERE project_id = '${projectId}'`,
      );

      await queryRunner.query(
        `DELETE FROM testreports WHERE test_suite_id IN (SELECT id FROM testsuites WHERE project_id = '${projectId}');`,
      );

      const testCaseResult: any = await queryRunner.query(
        `select * FROM test_case_results WHERE test_suite_id IN (SELECT id FROM testsuites WHERE project_id = '${projectId}');`,
      );

      for (const testcase of testCaseResult) {
        if (testcase?.image) {
          const url = testcase?.image?.split("/");
          const len = url.length;
          const key = `${url[len - 2]}/${url[len - 1]}`;
          this.awsS3Service.deleteFile(key);
        }
      }

      await queryRunner.query(
        `select * FROM test_case_results WHERE test_suite_id IN (SELECT id FROM testsuites WHERE project_id = '${projectId}');`,
      );

      await queryRunner.query(
        `DELETE FROM testsuites WHERE project_id = '${projectId}'`,
      );
      await queryRunner.query(
        `DELETE FROM testcases WHERE project_id = '${projectId}'`,
      );
      await queryRunner.query(
        `DELETE FROM milestones WHERE project_id = '${projectId}'`,
      );
      await queryRunner.query(
        `DELETE FROM sections WHERE project_id = '${projectId}'`,
      );
      await queryRunner.query(
        `DELETE FROM user_favorite_projects WHERE projects_id = '${projectId}'`,
      );
      await queryRunner.query(
        `DELETE FROM project_members WHERE project_id = '${projectId}'`,
      );
      await queryRunner.query(`DELETE FROM projects WHERE id = '${projectId}'`);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
    return true;
  }

  /**
   * Delete a section
   */

  async deleteSection(
    projectId: string,
    sectionId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<boolean> {
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
    const check = await this.sectionService.deleteSection(
      project.sections?.length ? project.sections[0] : null,
    );
    if (!check)
      throw new InternalServerErrorException("translations.INTERNAL_SERVER");
    return true;
  }

  /**
   * Remove favorite project for user
   */
  async removeFavoriteProject(
    projectId: string,
    currentLoggedInUser: UserEntity,
  ): Promise<boolean> {
    await this.projectReadService.checkProjectForUser(
      projectId,
      currentLoggedInUser.organization.id,
    );
    await this.userDeleteService.deleteFavoriteProject(
      projectId,
      currentLoggedInUser,
    );
    return true;
  }
}
