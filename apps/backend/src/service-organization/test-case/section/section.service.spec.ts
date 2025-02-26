import { Test, TestingModule } from "@nestjs/testing";
import { mocked } from "jest-mock";

import { SectionService } from "./section.service";
import { ProjectReadService } from "../../project/services/read.service";
import { SectionEntity } from "./section.entity";
import { SectionPageDto } from "./dto/SectionPageDto";
import { SectionPageOptionsDto } from "./dto/SectionPageOptionsDto";
import { SectionDto } from "./dto/SectionDto";

const mockSectionService = () => ({
  getAllSections: jest.fn(),
  addSection: jest.fn(),
  editSection: jest.fn(),
  deleteSection: jest.fn(),
  findOne: jest.fn(),
  getSectionsByProjectIdAndSectionId: jest.fn(),
});

const mockProjectReadService = () => ({
  checkProjectForUser: jest.fn(),
});

const mockProject: any = {
  id: "933af9ff-9156-4c26-9c29-d43cfbe6fff6",
  name: "Project 1",
  description: "Project 1 description",
  organization: {
    id: "827af9ff-9156-4c26-9c29-d43cfbe6fff6",
    name: "keka",
  },
};

const mockSection: any = {
  id: "89526341-9156-4c26-9c29-d43cfbe6fff6",
  name: "Login",
  description: "All Login related testcases",
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

const mockSectionPageOptionsDto = new SectionPageOptionsDto();

describe("SectionService", () => {
  let sectionService: SectionService;
  let projectReadService: ProjectReadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SectionService,
          useFactory: mockSectionService,
        },
        {
          provide: ProjectReadService,
          useFactory: mockProjectReadService,
        },
      ],
    }).compile();
    sectionService = module.get<SectionService>(SectionService);
    projectReadService = module.get<ProjectReadService>(ProjectReadService);
  });

  /**
   * Create a section
   */
  describe("Create section", () => {
    it("should return an error if project not found", async () => {
      mocked(projectReadService.checkProjectForUser).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched")),
      );
      expect(
        projectReadService.checkProjectForUser(
          mockProject.id,
          mockedUser.organization.id,
        ),
      ).rejects.toThrow("Project could not be fetched");
    });

    it("should return an error if section with duplicate name exists", async () => {
      mocked(sectionService.findOne).mockImplementation(() =>
        Promise.reject(null),
      );
      expect(
        sectionService.findOne({
          name: mockSection.name,
        }),
      ).rejects.toBeNull();
    });

    it("should create a new section", async () => {
      expect(mockSection).toHaveProperty("name");
      expect(mockSection).toHaveProperty("description");

      mocked(sectionService.addSection).mockImplementation(() =>
        Promise.resolve(mockSection as SectionEntity),
      );
      expect(sectionService.addSection(mockSection, mockProject)).resolves.toBe(
        mockSection,
      );
    });
  });

  /**
   * Edit a section
   */
  describe("Edit section", () => {
    it("should return an error if project not found", async () => {
      mocked(projectReadService.checkProjectForUser).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched")),
      );
      expect(
        projectReadService.checkProjectForUser(
          mockProject.id,
          mockedUser.organization.id,
        ),
      ).rejects.toThrow("Project could not be fetched");
    });

    it("should return an error if section not found", async () => {
      mocked(sectionService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Section not found")),
      );
      expect(
        sectionService.findOne({
          id: mockSection.id,
        }),
      ).rejects.toThrow("Section not found");
    });

    it("should edit the section", async () => {
      mocked(sectionService.editSection).mockImplementation(() =>
        Promise.resolve(mockSection as SectionEntity),
      );
      expect(
        sectionService.editSection(mockSection, mockSection, mockProject),
      ).resolves.toBe(mockSection);
    });
  });

  /**
   * get all sections
   */
  describe("Get sections", () => {
    it("should return an error if project not found", async () => {
      mocked(projectReadService.checkProjectForUser).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched")),
      );
      expect(
        projectReadService.checkProjectForUser(
          mockProject.id,
          mockedUser.organization.id,
        ),
      ).rejects.toThrow("Project could not be fetched");
    });

    it("should get all the sections of a project", async () => {
      mocked(sectionService.getAllSections).mockImplementation(() =>
        Promise.resolve([mockSection] as unknown as SectionPageDto),
      );
      expect(
        sectionService.getAllSections(
          mockSectionPageOptionsDto,
          mockProject.id,
        ),
      ).resolves.toEqual([mockSection]);
    });
  });

  /**
   * Delete a section
   */
  describe("Edit section", () => {
    it("should return an error if project not found", async () => {
      mocked(projectReadService.checkProjectForUser).mockImplementation(() =>
        Promise.reject(new Error("Project could not be fetched")),
      );
      expect(
        projectReadService.checkProjectForUser(
          mockProject.id,
          mockedUser.organization.id,
        ),
      ).rejects.toThrow("Project could not be fetched");
    });

    it("should return an error if section not found", async () => {
      mocked(sectionService.findOne).mockImplementation(() =>
        Promise.reject(new Error("Section not found")),
      );
      expect(
        sectionService.findOne({
          id: mockSection.id,
        }),
      ).rejects.toThrow("Section not found");
    });

    it("should delete the section", async () => {
      mocked(sectionService.deleteSection).mockImplementation(() =>
        Promise.resolve(true),
      );
      expect(
        sectionService.deleteSection(mockSection.id),
      ).resolves.toBeTruthy();
    });
  });

  /**
   * Testing to get sections by project id and sections ids
   */
  describe("getSectionsByProjectIdAndSectionId", () => {
    it("should return an error if project id or section ids not provided", async () => {
      mocked(
        sectionService.getSectionsByProjectIdAndSectionId,
      ).mockImplementation(() =>
        Promise.reject(new Error("Section not found")),
      );
      expect(
        sectionService.getSectionsByProjectIdAndSectionId(null, null),
      ).rejects.toThrow("Section not found");
    });
    it("should return sections", async () => {
      const sectionIds = [...mockSection.id];

      mocked(
        sectionService.getSectionsByProjectIdAndSectionId,
      ).mockImplementation(() =>
        Promise.resolve(mockSection as unknown as SectionDto[]),
      );
      expect(
        sectionService.getSectionsByProjectIdAndSectionId(
          sectionIds,
          mockProject.id,
        ),
      ).resolves.toStrictEqual(mockSection);
    });
  });
});
