import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getCourseCategories = createAsyncThunk("courseCategories/getCourseCategories", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/courseCategories', 'get', null, getState, dispatch, 'getCourseCategories'))

export const createCourseCategory = createAsyncThunk("courseCategories/createCourseCategory", async (newCourseCategory, { getState, dispatch }) =>
  apiCallHelper('/api/courseCategories', 'post', newCourseCategory, getState, dispatch, 'createCourseCategory'))

export const updateCourseCategory = createAsyncThunk("courseCategories/updateCourseCategory", async (updatedCourseCatg, { getState, dispatch }) =>
  apiCallHelper(`/api/courseCategories/${updatedCourseCatg.idToUpdate}`, 'put', updatedCourseCatg, getState, dispatch, 'updateCourseCategory'))

export const deleteCourseCategory = createAsyncThunk("courseCategories/deleteCourseCategory", async (courseCatgID, { getState, dispatch }) =>
  apiCallHelper(`/api/courseCategories/${courseCatgID}`, 'delete', null, getState, dispatch, 'deleteCourseCategory'))

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
    builder.addCase(getCourseCategories.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createCourseCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateCourseCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteCourseCategory.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getCourseCategories.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(createCourseCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateCourseCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteCourseCategory.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

export const { clearCourseCategories } = courseCategoriesSlice.actions
export default courseCategoriesSlice.reducer