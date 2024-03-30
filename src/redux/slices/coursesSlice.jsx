import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getCourses = createAsyncThunk("courses/getCourses", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/courses', 'get', null, getState, dispatch, 'getCourses'))

export const getOneCourse = createAsyncThunk("courses/getOneCourse", async (courseId, { getState, dispatch }) =>
  apiCallHelper(`/api/courses/${courseId}`, 'get', null, getState, dispatch, 'getOneCourse'))

export const getCoursesByCategory = createAsyncThunk("courses/getCoursesByCategory", async (cCId, { getState, dispatch }) =>
  apiCallHelper(`/api/courses/courseCategory/${cCId}`, 'get', null, getState, dispatch, 'getCoursesByCategory'))

export const createCourse = createAsyncThunk("courses/createCourse", async (newCourses, { getState, dispatch }) =>
  apiCallHelper('/api/courses', 'post', newCourses, getState, dispatch, 'createCourse'))

export const updateCourse = createAsyncThunk("courses/updateCourse", async (updatedCourse, { getState, dispatch }) =>
  apiCallHelper(`/api/courses/${updatedCourse.idToUpdate}`, 'put', updatedCourse, getState, dispatch, 'updateCourse'))

export const deleteCourse = createAsyncThunk("courses/deleteCourse", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/courses/${id}`, 'delete', null, getState, dispatch, 'deleteCourse'))

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
    builder.addCase(getCourses.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneCourse.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getCoursesByCategory.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createCourse.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateCourse.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteCourse.pending, state => {
      state.isLoading = true
    })


    // Rejected actions
    builder.addCase(getCourses.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneCourse.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getCoursesByCategory.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createCourse.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateCourse.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteCourse.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearCourses } = coursesSlice.actions
export default coursesSlice.reducer