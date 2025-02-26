import axiosService from "../components/Utils/axios";

export const getArchiveMembers = () => {
  const resp = axiosService.get(`organizations/archive/members`);
  return resp;
};
