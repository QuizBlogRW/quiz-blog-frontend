import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getFaculties = createAsyncThunk("faculties/getFaculties", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/faculties', 'get', null, getState, dispatch, 'getFaculties'))

export const fetchLevelFaculties = createAsyncThunk("faculties/fetchLevelFaculties", async (levelID, { getState, dispatch }) =>
  apiCallHelper(`/api/faculties/level/${levelID}`, 'get', null, getState, dispatch, 'fetchLevelFaculties'))

export const createFaculty = createAsyncThunk("faculties/createFaculty", async (newFaculty, { getState, dispatch }) =>
  apiCallHelper('/api/faculties', 'post', newFaculty, getState, dispatch, 'createFaculty'))

export const updateFaculty = createAsyncThunk("faculties/updateFaculty", async (updatedFac, { getState, dispatch }) =>
  apiCallHelper(`/api/faculties/${updatedFac.idToUpdate}`, 'put', updatedFac, getState, dispatch, 'updateFaculty'))

export const deleteFaculty = createAsyncThunk("faculties/deleteFaculty", async (facultyID, { getState, dispatch }) =>
  apiCallHelper(`/api/faculties/${facultyID}`, 'delete', null, getState, dispatch, 'deleteFaculty'))

// Faculties slice
const initialState = {
  allFaculties: [],
  levelFaculties: [],
  isLoading: false
}

const facultiesSlice = createSlice({
  name: 'faculties',
  initialState,
  reducers: {
    clearFaculties: state => {
      state.allFaculties = []
      state.levelFaculties = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getFaculties.fulfilled, (state, action) => {
      state.allFaculties = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchLevelFaculties.fulfilled, (state, action) => {
      state.levelFaculties = action.payload
      state.isLoading = false
    })
    builder.addCase(createFaculty.fulfilled, (state, action) => {
      state.allFaculties.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateFaculty.fulfilled, (state, action) => {
      state.allFaculties = state.allFaculties.map(faculty => faculty._id === action.payload._id ? action.payload : faculty)
      state.isLoading = false
    })
    builder.addCase(deleteFaculty.fulfilled, (state, action) => {
      state.allFaculties = state.allFaculties.filter(faculty => faculty._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getFaculties.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchLevelFaculties.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createFaculty.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateFaculty.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteFaculty.pending, state => {
      state.isLoading = true
    })


    // Rejected actions
    builder.addCase(getFaculties.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(fetchLevelFaculties.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createFaculty.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateFaculty.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteFaculty.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearFaculties } = facultiesSlice.actions
export default facultiesSlice.reducer