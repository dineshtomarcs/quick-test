import { AxiosResponse } from "axios";
import axiosService from "../components/Utils/axios";
import { API_CONSTANTS } from "../constants/apiConstants";
import { SectionType } from "../types/sectionTypes";

export interface GetSectionParams {
  pid: string;
}

interface TestCasesListingResponse {
  success: boolean;
  message: string;
  data: SectionType[];
}

export const getTestCasesApi = async (pid: string) => {
  let response: AxiosResponse<TestCasesListingResponse, any>;
  response = await axiosService.get(
    `${API_CONSTANTS.PROJECTS}/${pid}${API_CONSTANTS.TEST_CASES}`
  );
  return response.data;
};

export const createTestCases = async (testCaseObj: any) => {
  const response = await axiosService.post(
    `/projects/${testCaseObj?.projectId}/test-cases`,
    { testcase: testCaseObj?.testcase, sectionId: testCaseObj?.sectionId }
  );
  return response.data;
};

export const editTestCasesApi = async (
  pid: string,
  testcaseID: string,
  payload: any
) => {
  let response: AxiosResponse<TestCasesListingResponse, any>;
  response = await axiosService.put(
    `${API_CONSTANTS.PROJECTS}/${pid}${API_CONSTANTS.TEST_CASES}/${testcaseID}`,
    payload
  );
  return response.data;
};
