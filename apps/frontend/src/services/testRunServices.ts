import axiosService from "../components/Utils/axios";

type getTestRunParams = {
  pid: string;
  pageNum: number;
};

export const getTestRunDetails = async ({
  pid,
  pageNum = 0,
}: getTestRunParams) => {
  const response = await axiosService.get(
    `/projects/${pid}/test-suites?order=DESC&page=${pageNum}&take=20`
  );
  return {
    ...response.data,
    prevOffSet: pageNum + 1,
  };
};

export const getTestRunResults = async ({ pid, pageNum }: getTestRunParams) => {
  const response = await axiosService.get(
    `/test-suites/${pid}/test-results?page=${pageNum}&take=20`
  );
  return {
    ...response.data,
    prevOffSet: pageNum + 1,
  };
};
