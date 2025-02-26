import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTestCasesApi } from "../services/testCasesServices";
import { SectionType } from "../types/sectionTypes";
import { RootState } from "../store";

interface TestCasesState {
  testCases: SectionType[];
  isLoading: boolean;
}

const initialState: TestCasesState = {
  testCases: [],
  isLoading: false,
};

export const getTestCasesData = createAsyncThunk(
  "testCases/fetchData",
  async (pid: string) => {
    try {
      return getTestCasesApi(pid);
    } catch (error) {
      return Promise.reject(error.message);
    }
  }
);

const testCaseSlice = createSlice({
  name: "testCase",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getTestCasesData.pending, (state) => {
      if (state.testCases.length === 0) {
        state.isLoading = true;
      }
    });
    builder.addCase(getTestCasesData.fulfilled, (state, action) => {
      state.isLoading = false;
      state.testCases = action.payload.data;
    });
    builder.addCase(getTestCasesData.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const testCaseData = (state: RootState) => state.testCases;
export default testCaseSlice.reducer;
