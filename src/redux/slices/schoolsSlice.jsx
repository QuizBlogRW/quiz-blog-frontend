import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getSchools = createAsyncThunk("schools/getSchools", async (_, { getState }) =>
  apiCallHelper('/api/schools', 'get', null, getState, 'getSchools'))

export const getOneSchool = createAsyncThunk("schools/getOneSchool", async (schoolId, { getState }) =>
  apiCallHelper(`/api/schools/${schoolId}`, 'get', null, getState, 'getOneSchool'))

export const createSchool = createAsyncThunk("schools/createSchool", async (newSchool, { getState }) =>
  apiCallHelper('/api/schools', 'post', newSchool, getState, 'createSchool'))

export const updateSchool = createAsyncThunk("schools/updateSchool", async (updatedsch, { getState }) =>
  apiCallHelper(`/api/schools/${updatedsch.idToUpdate}`, 'put', updatedsch, getState, 'updateSchool'))

export const deleteSchool = createAsyncThunk("schools/deleteSchool", async (schoolId, { getState }) =>
  apiCallHelper(`/api/schools/${schoolId}`, 'delete', null, getState, 'deleteSchool'))


// Schools slice
const initialState = {
  allSchools: [],
  isLoading: false,
  oneSchool: {},
  error: null
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
    builder.addMatcher(
      (action) => [getSchools.pending, getOneSchool.pending, createSchool.pending, updateSchool.pending, deleteSchool.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getSchools.rejected, getOneSchool.rejected, createSchool.rejected, updateSchool.rejected, deleteSchool.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearSchools } = schoolsSlice.actions
export default schoolsSlice.reducer