import { TestCaseType } from "./testCaseTypes";

export interface SectionType {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  testcases: TestCaseType[];
}
