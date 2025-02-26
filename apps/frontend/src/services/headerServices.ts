import axiosService from "../components/Utils/axios";

export const getProjectsDetails = async ({
  pid,
}: {
  pid: string | undefined;
}) => {
  const response = await axiosService.get(`/projects/${pid}`);
  return response?.data?.data;
};
