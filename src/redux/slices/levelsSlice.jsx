import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getLevels = createAsyncThunk("levels/getLevels", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/levels', 'get', null, getState, dispatch, 'getLevels'))

export const fetchSchoolLevels = createAsyncThunk("levels/fetchSchoolLevels", async (schoolID, { getState, dispatch }) =>
  apiCallHelper(`/api/levels/school/${schoolID}`, 'get', null, getState, dispatch, 'fetchSchoolLevels'))

export const createLevel = createAsyncThunk("levels/createLevel", async (newLevel, { getState, dispatch }) =>
  apiCallHelper('/api/levels', 'post', newLevel, getState, dispatch, 'createLevel'))

export const updateLevel = createAsyncThunk("levels/updateLevel", async (updatedLevel, { getState, dispatch }) =>
  apiCallHelper(`/api/levels/${updatedLevel.idToUpdate}`, 'put', updatedLevel, getState, dispatch, 'updateLevel'))

export const deleteLevel = createAsyncThunk("levels/deleteLevel", async (levelID, { getState, dispatch }) =>
  apiCallHelper(`/api/levels/${levelID}`, 'delete', null, getState, dispatch, 'deleteLevel'))

// Levels slice
const initialState = {
  allLevels: [],
  isLoading: false,
  schoolLevels: []
}

const levelsSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    clearLevels: state => {
      state.allLevels = []
      state.isLoading = false
      state.schoolLevels = []
    }
  },
  extraReducers: (builder) => {

    // Fulfilled actions
    builder.addCase(getLevels.fulfilled, (state, action) => {
      state.allLevels = action.payload
      state.isLoading = false
    })
    builder.addCase(fetchSchoolLevels.fulfilled, (state, action) => {
      state.schoolLevels = action.payload
      state.isLoading = false
    })
    builder.addCase(createLevel.fulfilled, (state, action) => {
      state.allLevels.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateLevel.fulfilled, (state, action) => {
      state.allLevels = state.allLevels.map(level => level._id === action.payload._id ? action.payload : level)
      state.isLoading = false
    })
    builder.addCase(deleteLevel.fulfilled, (state, action) => {
      state.allLevels = state.allLevels.filter(level => level._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getLevels.pending, state => {
      state.isLoading = true
    })
    builder.addCase(fetchSchoolLevels.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createLevel.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateLevel.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteLevel.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getLevels.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(fetchSchoolLevels.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createLevel.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateLevel.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteLevel.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearLevels } = levelsSlice.actions
export default levelsSlice.reducer