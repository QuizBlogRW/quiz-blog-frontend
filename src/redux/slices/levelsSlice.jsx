import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getLevels = createAsyncThunk("levels/getLevels", async (_, { getState }) =>
  apiCallHelper('/api/levels', 'get', null, getState, 'getLevels'))

export const fetchSchoolLevels = createAsyncThunk("levels/fetchSchoolLevels", async (schoolID, { getState }) =>
  apiCallHelper(`/api/levels/school/${schoolID}`, 'get', null, getState, 'fetchSchoolLevels'))

export const createLevel = createAsyncThunk("levels/createLevel", async (newLevel, { getState }) =>
  apiCallHelper('/api/levels', 'post', newLevel, getState, 'createLevel'))

export const updateLevel = createAsyncThunk("levels/updateLevel", async (updatedLevel, { getState }) =>
  apiCallHelper(`/api/levels/${updatedLevel.idToUpdate}`, 'put', updatedLevel, getState, 'updateLevel'))

export const deleteLevel = createAsyncThunk("levels/deleteLevel", async (levelID, { getState }) =>
  apiCallHelper(`/api/levels/${levelID}`, 'delete', null, getState, 'deleteLevel'))

// Levels slice
const initialState = {
  allLevels: [],
  isLoading: false,
  schoolLevels: [],
  error: null
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
    builder.addMatcher(
      (action) => [getLevels.pending, fetchSchoolLevels.pending, createLevel.pending, updateLevel.pending, deleteLevel.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getLevels.rejected, fetchSchoolLevels.rejected, createLevel.rejected, updateLevel.rejected, deleteLevel.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearLevels } = levelsSlice.actions
export default levelsSlice.reducer