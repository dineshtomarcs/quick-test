import axiosService from "../components/Utils/axios"

export const getMilestoneDataDetails = async ({ pid }: { pid: string | undefined }) => {
    const response = await axiosService.get(`projects/${pid}/milestones`);
    return response?.data;
}
export const getSingleMilestoneDataDetails = async ({ id }: { id: string | undefined }) => {
    const response = await axiosService.get(`/milestones/${id}`);
    return response?.data?.data;
}
