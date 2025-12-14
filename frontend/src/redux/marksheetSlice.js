import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// 1️⃣ Fetch all exams
export const fetchExams = createAsyncThunk(
  "marksheets/fetchExams",
  async () => {
    const response = await axios.get(`${BASE_URL}/marksheet/exams`);
    return response.data;
  }
);

// 2️⃣ Fetch all classes
export const fetchClasses = createAsyncThunk(
  "marksheets/fetchClasses",
  async () => {
    const response = await axios.get(`${BASE_URL}/marksheet/classes`);
    return response.data;
  }
);

// 3️⃣ Fetch students by class & exam
export const fetchStudentsByClass = createAsyncThunk(
  "marksheets/fetchStudentsByClass",
  async ({ className, examName }) => {
    const response = await axios.get(
      `${BASE_URL}/marksheet/students?className=${className}&examName=${examName}`
    );
    return response.data;
  }
);

// 4️⃣ Add/Update marks
export const addMarks = createAsyncThunk(
  "marksheets/addMarks",
  async (marksPayload) => {
    const response = await axios.post(
      `${BASE_URL}/marksheet/marks`,
      marksPayload
    );
    return response.data;
  }
);

const marksheetSlice = createSlice({
  name: "marksheets",
  initialState: {
    exams: [],
    classes: [],
    students: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Exams
    builder.addCase(fetchExams.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchExams.fulfilled, (state, action) => {
      state.loading = false;
      state.exams = action.payload;
    });
    builder.addCase(fetchExams.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetch Classes
    builder.addCase(fetchClasses.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchClasses.fulfilled, (state, action) => {
      state.loading = false;
      state.classes = action.payload;
    });
    builder.addCase(fetchClasses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Fetch Students by Class
    builder.addCase(fetchStudentsByClass.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.students = [];
    });
    builder.addCase(fetchStudentsByClass.fulfilled, (state, action) => {
      state.loading = false;
      state.students = action.payload;
    });
    builder.addCase(fetchStudentsByClass.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // Add Marks
    builder.addCase(addMarks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addMarks.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(addMarks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export default marksheetSlice.reducer;
