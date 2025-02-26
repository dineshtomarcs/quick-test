import { AxiosResponse } from "axios";
import axiosService from "../components/Utils/axios";
import { API_CONSTANTS } from "../constants/apiConstants";
import { SectionType } from "../types/sectionTypes";
import { Pagination } from "../types/commonTypes";

export interface GetSectionParams {
  pid: string;
}

interface SectionsListingResponse {
  success: boolean;
  message: string;
  data: { data: SectionType[]; meta: Pagination };
}

export const getSectionsApi = async (pid: string) => {
  let response: AxiosResponse<SectionsListingResponse, any>;
  response = await axiosService.get(
    `${API_CONSTANTS.PROJECTS}/${pid}${API_CONSTANTS.SECTIONS}`
  );
  return response.data;
};

export const deleteSectionApi = async (pid: string, sectionId: string) => {
  let response: AxiosResponse<any, any>;
  response = await axiosService.delete(
    `${API_CONSTANTS.PROJECTS}/${pid}${API_CONSTANTS.SECTIONS}/${sectionId}`,
    {}
  );
  return response.data;
};
