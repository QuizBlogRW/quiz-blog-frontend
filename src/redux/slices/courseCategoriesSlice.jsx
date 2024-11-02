import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getCourseCategories = createAsyncThunk("courseCategories/getCourseCategories", async (_, { getState }) =>
  apiCallHelper('/api/courseCategories', 'get', null, getState, 'getCourseCategories'))

export const createCourseCategory = createAsyncThunk("courseCategories/createCourseCategory", async (newCourseCategory, { getState }) =>
  apiCallHelper('/api/courseCategories', 'post', newCourseCategory, getState, 'createCourseCategory'))

export const updateCourseCategory = createAsyncThunk("courseCategories/updateCourseCategory", async (updatedCourseCatg, { getState }) =>
  apiCallHelper(`/api/courseCategories/${updatedCourseCatg.idToUpdate}`, 'put', updatedCourseCatg, getState, 'updateCourseCategory'))

export const deleteCourseCategory = createAsyncThunk("courseCategories/deleteCourseCategory", async (courseCatgID, { getState }) =>
  apiCallHelper(`/api/courseCategories/${courseCatgID}`, 'delete', null, getState, 'deleteCourseCategory'))

// Course categories slice
const initialState = {
  allCourseCategories: [],
  isLoading: false
}

const courseCategoriesSlice = createSlice({
  name: 'courseCategories',
  initialState,
  reducers: {
    clearCourseCategories: state => {
      state.allCourseCategories = []
      state.isLoading = true
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getCourseCategories.fulfilled, (state, action) => {
      state.allCourseCategories = action.payload
      state.isLoading = false
    })
    builder.addCase(createCourseCategory.fulfilled, (state, action) => {
      state.allCourseCategories.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateCourseCategory.fulfilled, (state, action) => {
      state.allCourseCategories = state.allCourseCategories.map(courseCategory => courseCategory._id === action.payload._id ? action.payload : courseCategory)
      state.isLoading = false
    })
    builder.addCase(deleteCourseCategory.fulfilled, (state, action) => {
      state.allCourseCategories = state.allCourseCategories.filter(courseCategory => courseCategory._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addMatcher(
      (action) => [getCourseCategories.pending, createCourseCategory.pending, updateCourseCategory.pending, deleteCourseCategory.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getCourseCategories.rejected, createCourseCategory.rejected, updateCourseCategory.rejected, deleteCourseCategory.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearCourseCategories } = courseCategoriesSlice.actions
export default courseCategoriesSlice.reducer