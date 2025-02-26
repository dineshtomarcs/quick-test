import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SectionType } from "../types/sectionTypes";
import { RootState } from "../store";
import { getSectionsApi } from "../services/sectionServices";

interface sectionState {
  sections: SectionType[];
  isLoading: boolean;
}

const initialState: sectionState = {
  sections: [],
  isLoading: false,
};

export const getSectionsData = createAsyncThunk(
  "sections/fetchData",
  async (pid: string) => {
    try {
      return getSectionsApi(pid);
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getSectionsData.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSectionsData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.sections = action.payload.data.data;
    });
    builder.addCase(getSectionsData.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const sectionsData = (state: RootState) => state.sections;
export default sectionSlice.reducer;
