import { ApiPropertyOptional } from "@nestjs/swagger";

export class DashboardCountsDto {
  @ApiPropertyOptional()
  projects: number;

  @ApiPropertyOptional()
  testCases: number;

  constructor(counts: { projects: number; testCases: number }) {
    this.projects = counts.projects;
    this.testCases = counts.testCases;
  }
}
