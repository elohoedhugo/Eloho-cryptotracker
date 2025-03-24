import { configureStore } from "@reduxjs/toolkit";
import trackerReducer from "./trackerSlice";


const store = configureStore({
  reducer: {
    tracker: trackerReducer,
  },
});

export default store;