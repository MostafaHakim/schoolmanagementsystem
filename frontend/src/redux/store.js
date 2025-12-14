import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "./studentsSlice";
import subjectReducer from "./subjectSlice";
import marksheetReducer from "./marksheetSlice";
const store = configureStore({
  reducer: {
    students: studentsReducer,
    subjects: subjectReducer,
    marksheets: marksheetReducer,
  },
});

export default store;
