import axiosService from "../components/Utils/axios";

export const getUserProfileDetails = async ({
  pageNum,
}: {
  pageNum: number;
}) => {
  const response = await axiosService.get(
    `/organizations/members?order=DESC&page=${pageNum}&take=20`
  );
  return {
    ...response.data,
    prevOffSet: pageNum + 1,
  };
};
