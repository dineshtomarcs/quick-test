export interface TestCaseType {
  id: string;
  createdAt: string;
  updatedAt: string;
  testcaseId: number;
  title: string;
  preconditions: string;
  steps: string;
  expectedResults: string;
  createdBy: {
    id: string;
    createdAt: string;
    updatedAt: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  executionPriority: string;
  priority: number;
  index?: number;
}

export interface SerialisedTestCaseType extends TestCaseType {
  serialNumber: number;
  checked: boolean;
  sectionId?: string;
}
