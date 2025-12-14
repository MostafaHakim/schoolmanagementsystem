import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Fetch all students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",
  async () => {
    const response = await axios.get(`${BASE_URL}/students`);
    return response.data;
  }
);

// Add new student
export const addStudent = createAsyncThunk(
  "students/addStudent",
  async (student) => {
    const response = await axios.post(`${BASE_URL}/students`, student);
    return response.data;
  }
);

// Update student
export const updateStudent = createAsyncThunk(
  "students/updateStudent",
  async ({ id, student }) => {
    const response = await axios.put(`${BASE_URL}/students/${id}`, student);
    return response.data;
  }
);

// Delete student
export const deleteStudent = createAsyncThunk(
  "students/deleteStudent",
  async (id) => {
    await axios.delete(`${BASE_URL}/students/${id}`);
    return id;
  }
);

const studentsSlice = createSlice({
  name: "students",
  initialState: { students: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state) => {
        state.loading = false;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.students.push(action.payload);
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.students.findIndex(
          (s) => s._id === action.payload._id
        );
        if (index !== -1) state.students[index] = action.payload;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.students = state.students.filter((s) => s._id !== action.payload);
      });
  },
});

export default studentsSlice.reducer;
