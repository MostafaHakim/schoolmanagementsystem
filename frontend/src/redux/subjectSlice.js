import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Load all subjects
export const fetchSubjects = createAsyncThunk(
  "subjects/fetchSubjects",
  async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subjects`);
    return await res.json();
  }
);

// Add subject
export const addSubject = createAsyncThunk(
  "subjects/addSubject",
  async (formData, { rejectWithValue }) => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.message);
    return data;
  }
);

// Update subject
export const updateSubject = createAsyncThunk(
  "subjects/updateSubject",
  async ({ id, formData }) => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/subjects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    return await res.json();
  }
);

// Delete subject
export const deleteSubject = createAsyncThunk(
  "subjects/deleteSubject",
  async (id) => {
    await fetch(`${import.meta.env.VITE_BASE_URL}/subjects/${id}`, {
      method: "DELETE",
    });
    return id;
  }
);

const subjectSlice = createSlice({
  name: "subjects",
  initialState: { list: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchSubjects.rejected, (state) => {
        state.loading = false;
      })

      // ADD (MULTIPLE)
      .addCase(addSubject.fulfilled, (state, action) => {
        if (action.payload?.data) {
          state.list.push(...action.payload.data); // 🔥 important
        }
      })

      // UPDATE (SINGLE)
      .addCase(updateSubject.fulfilled, (state, action) => {
        const index = state.list.findIndex((s) => s._id === action.payload._id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      // DELETE
      .addCase(deleteSubject.fulfilled, (state, action) => {
        state.list = state.list.filter((s) => s._id !== action.payload);
      });
  },
});

export default subjectSlice.reducer;
