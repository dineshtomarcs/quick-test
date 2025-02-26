import axiosService from "../components/Utils/axios";

export const getProjects = () => {
  return axiosService.get(`/organizations/projects`);
};

