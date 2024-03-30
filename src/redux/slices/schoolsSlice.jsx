import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getSchools = createAsyncThunk("schools/getSchools", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/schools', 'get', null, getState, dispatch, 'getSchools'))

export const getOneSchool = createAsyncThunk("schools/getOneSchool", async (schoolId, { getState, dispatch }) =>
  apiCallHelper(`/api/schools/${schoolId}`, 'get', null, getState, dispatch, 'getOneSchool'))

export const createSchool = createAsyncThunk("schools/createSchool", async (newSchool, { getState, dispatch }) =>
  apiCallHelper('/api/schools', 'post', newSchool, getState, dispatch, 'createSchool'))

export const updateSchool = createAsyncThunk("schools/updateSchool", async (updatedsch, { getState, dispatch }) =>
  apiCallHelper(`/api/schools/${updatedsch.idToUpdate}`, 'put', updatedsch, getState, dispatch, 'updateSchool'))

export const deleteSchool = createAsyncThunk("schools/deleteSchool", async (schoolId, { getState, dispatch }) =>
  apiCallHelper(`/api/schools/${schoolId}`, 'delete', null, getState, dispatch, 'deleteSchool'))


// Schools slice
const initialState = {
  allSchools: [],
  isLoading: false,
  oneSchool: {}
}

const schoolsSlice = createSlice({
  name: 'schools',
  initialState,
  reducers: {
    clearSchools: state => {
      state.allSchools = []
      state.isLoading = false
      state.oneSchool = {}
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getSchools.fulfilled, (state, action) => {
      state.allSchools = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneSchool.fulfilled, (state, action) => {
      state.oneSchool = action.payload
      state.isLoading = false
    })
    builder.addCase(createSchool.fulfilled, (state, action) => {
      state.allSchools.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateSchool.fulfilled, (state, action) => {
      state.allSchools = state.allSchools.map(school => school._id === action.payload._id ? action.payload : school)
      state.isLoading = false
    })
    builder.addCase(deleteSchool.fulfilled, (state, action) => {
      state.allSchools = state.allSchools.filter(school => school._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getSchools.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getOneSchool.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createSchool.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateSchool.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteSchool.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getSchools.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getOneSchool.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(createSchool.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateSchool.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteSchool.rejected, (state, action) => {
      state.isLoading = false
    })

  }
})

export const { clearSchools } = schoolsSlice.actions
export default schoolsSlice.reducer