import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getChapters = createAsyncThunk("chapters/getChapters", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/chapters', 'get', null, getState, dispatch, 'getChapters'))

export const getChaptersByCourse = createAsyncThunk("chapters/getChaptersByCourse", async (courseId, { getState, dispatch }) =>
  apiCallHelper(`/api/chapters/course/${courseId}`, 'get', null, getState, dispatch, 'getChaptersByCourse'))

export const createChapter = createAsyncThunk("chapters/createChapter", async (newChapter, { getState, dispatch }) =>
  apiCallHelper('/api/chapters', 'post', newChapter, getState, dispatch, 'createChapter'))

export const updateChapter = createAsyncThunk("chapters/updateChapter", async (updatedChapter, { getState, dispatch }) =>
  apiCallHelper(`/api/chapters/${updatedChapter.idToUpdate}`, 'put', updatedChapter, getState, dispatch, 'updateChapter'))

export const deleteChapter = createAsyncThunk("chapters/deleteChapter", async (chapterID, { getState, dispatch }) =>
  apiCallHelper(`/api/chapters/${chapterID}`, 'delete', null, getState, dispatch, 'deleteChapter'))

// Chapters slice
const initialState = {
  allChapters: [],
  isLoading: false,
  chaptersByCourse: []
}

const chaptersSlice = createSlice({
  name: 'chapters',
  initialState,
  reducers: {
    clearChapters: state => {
      state.allChapters = []
      state.isLoading = false
      state.chaptersByCourse = []
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getChapters.fulfilled, (state, action) => {
      state.allChapters = action.payload
      state.isLoading = false
    })
    builder.addCase(getChaptersByCourse.fulfilled, (state, action) => {
      state.chaptersByCourse = action.payload
      state.isByCourseLoading = false
    })
    builder.addCase(createChapter.fulfilled, (state, action) => {
      state.allChapters.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateChapter.fulfilled, (state, action) => {
      state.allChapters = state.allChapters.map(chapter => chapter._id === action.payload._id ? action.payload : chapter)
      state.isLoading = false
    })
    builder.addCase(deleteChapter.fulfilled, (state, action) => {
      state.allChapters = state.allChapters.filter(chapter => chapter._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getChapters.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getChaptersByCourse.pending, state => {
      state.isByCourseLoading = true
    })
    builder.addCase(createChapter.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateChapter.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteChapter.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getChapters.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getChaptersByCourse.rejected, state => {
      state.isByCourseLoading = false
    })
    builder.addCase(createChapter.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateChapter.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteChapter.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearChapters } = chaptersSlice.actions
export default chaptersSlice.reducer