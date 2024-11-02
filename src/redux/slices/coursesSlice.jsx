import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getCourses = createAsyncThunk("courses/getCourses", async (_, { getState }) =>
  apiCallHelper('/api/courses', 'get', null, getState, 'getCourses'))

export const getOneCourse = createAsyncThunk("courses/getOneCourse", async (courseId, { getState }) =>
  apiCallHelper(`/api/courses/${courseId}`, 'get', null, getState, 'getOneCourse'))

export const getCoursesByCategory = createAsyncThunk("courses/getCoursesByCategory", async (cCId, { getState }) =>
  apiCallHelper(`/api/courses/courseCategory/${cCId}`, 'get', null, getState, 'getCoursesByCategory'))

export const createCourse = createAsyncThunk("courses/createCourse", async (newCourses, { getState }) =>
  apiCallHelper('/api/courses', 'post', newCourses, getState, 'createCourse'))

export const updateCourse = createAsyncThunk("courses/updateCourse", async (updatedCourse, { getState }) =>
  apiCallHelper(`/api/courses/${updatedCourse.idToUpdate}`, 'put', updatedCourse, getState, 'updateCourse'))

export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (id, { getState }) =>
  apiCallHelper(`/api/courses/${id}`, 'delete', null, getState, 'deleteCourse'))

// Courses slice
const initialState = {
  allCourses: [],
  coursesByCategory: [],
  oneCourse: {},
  isLoading: false
}

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    clearCourses: state => {
      state.allCourses = []
      state.coursesByCategory = []
      state.oneCourse = {}
      isLoading: false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getCourses.fulfilled, (state, action) => {
      state.allCourses = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneCourse.fulfilled, (state, action) => {
      state.oneCourse = action.payload
      state.isLoading = false
    })
    builder.addCase(getCoursesByCategory.fulfilled, (state, action) => {
      state.coursesByCategory = action.payload
      state.isLoading = false
    })
    builder.addCase(createCourse.fulfilled, (state, action) => {
      state.allCourses.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateCourse.fulfilled, (state, action) => {
      state.allCourses = state.allCourses.map(course => course._id === action.payload._id ? action.payload : course)
      state.isLoading = false
    })
    builder.addCase(deleteCourse.fulfilled, (state, action) => {
      state.allCourses = state.allCourses.filter(course => course._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addMatcher(
      (action) => [getCourses.pending, getOneCourse.pending, getCoursesByCategory.pending, createCourse.pending, updateCourse.pending, deleteCourse.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getCourses.rejected, getOneCourse.rejected, getCoursesByCategory.rejected, createCourse.rejected, updateCourse.rejected, deleteCourse.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearCourses } = coursesSlice.actions
export default coursesSlice.reducer