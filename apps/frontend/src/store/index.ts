import { configureStore } from "@reduxjs/toolkit"; // Import your root reducer
import rootReducer from "../reducers";

const store = configureStore({
  reducer: rootReducer,
  // Add middleware, enhancers, etc. if needed
});

export type RootState = ReturnType<typeof rootReducer>;
export default store;
export type AppDispatch = typeof store.dispatch;
