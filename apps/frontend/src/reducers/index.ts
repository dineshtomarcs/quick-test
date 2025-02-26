import { combineReducers } from "@reduxjs/toolkit";
import sectionReducer from "./sectionSlice";
import testCaseReducer from "./testCaseSlice";

const rootReducer = combineReducers({
  sections: sectionReducer,
  testCases: testCaseReducer,
  // Add other reducers here
});

export default rootReducer;
