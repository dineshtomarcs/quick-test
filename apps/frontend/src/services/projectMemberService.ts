import axiosService from "../components/Utils/axios";

export const getUnassignedProjectMembers = async (id:string) => {
  const response = axiosService.get(`/organizations/unassigned-members/${id}`);
  return (await response)?.data?.data
};

export const getAssignedProjectMembers = async (id:string) => {
    const response =  axiosService.get(`/organizations/assigned-members/${id}`)
    return (await response)?.data?.data
};

export const addProjectMembers = (members:object) => {
    return axiosService.post(`/organizations/assign-project-member`,members);
};

export const deleteProjectMembers = (projectId:string, userId:string) => {
  return axiosService.delete(`/organizations/project-member/${projectId}/${userId}`,{});
};