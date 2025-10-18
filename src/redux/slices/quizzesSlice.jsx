import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, handlePending, handleRejected } from '../configHelpers'

// Async actions with createAsyncThunk
export const getQuizzes = createAsyncThunk("quizzes/getQuizzes", async (_, { getState }) =>
  apiCallHelper(`/api/quizzes`, 'get', null, getState, 'getQuizzes'))

export const getLimitedQuizzes = createAsyncThunk("quizzes/getLimitedQuizzes", async ({ pageNo, limit, skip }, { getState }) =>
  apiCallHelper(`/api/quizzes?pageNo=${pageNo}&limit=${limit}&skip=${skip ? skip : 0}`, 'get', null, getState, 'getLimitedQuizzes'))

export const getOneQuiz = createAsyncThunk("quizzes/getOneQuiz", async (quizSlug, { getState }) =>
  apiCallHelper(`/api/quizzes/${quizSlug}`, 'get', null, getState, 'getOneQuiz'))

export const getQuizzesByCategory = createAsyncThunk("quizzes/getQuizzesByCategory", async (categoryID, { getState }) =>
  apiCallHelper(`/api/quizzes/category/${categoryID}`, 'get', null, getState, 'getQuizzesByCategory'))

export const getQuizzesByNotes = createAsyncThunk("quizzes/getQuizzesByNotes", async (courseCategoryID, { getState }) =>
  apiCallHelper(`/api/quizzes/course-notes/${courseCategoryID}`, 'get', null, getState, 'getQuizzesByNotes'))

export const createQuiz = createAsyncThunk("quizzes/createQuiz", async (newQuiz, { getState }) =>
  apiCallHelper('/api/quizzes', 'post', newQuiz, getState, 'createQuiz'))

export const updateQuiz = createAsyncThunk("quizzes/updateQuiz", async (updatedQuiz, { getState }) =>
  apiCallHelper(`/api/quizzes/${updatedQuiz.quizID}`, 'put', updatedQuiz, getState, 'updateQuiz'))

export const addVidLink = createAsyncThunk("quizzes/addVidLink", async ({ newVidLink, quizID }, { getState }) =>
  apiCallHelper(`/api/quizzes/add-video/${quizID}`, 'put', newVidLink, getState, 'addVidLink'))

export const deleteVideo = createAsyncThunk("quizzes/deleteVideo", async ({ vidData, vId }, { getState }) =>
  apiCallHelper(`/api/quizzes/delete-video/${vId}`, 'put', vidData, getState, 'deleteVideo'))

export const deleteQuiz = createAsyncThunk("quizzes/deleteQuiz", async (id, { getState }) =>
  apiCallHelper(`/api/quizzes/${id}`, 'delete', null, getState, 'deleteQuiz'))

export const notifying = createAsyncThunk("quizzes/notifying", async (newQuizInfo, { getState }) =>
  apiCallHelper('/api/quizzes/notifying', 'post', newQuizInfo, getState, 'notifying'))

// Quizzes slice
const initialState = {
  isLoading: false,
  oneQuiz: '',
  quizzes: [],
  limitedQuizzes: [],
  totalPages: 0,
  error: null
}

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    clearQuizzes: state => {
      state.limitedQuizzes = []
      state.quizzes = []
      state.isLoading = false
      state.oneQuiz = ''
      state.totalPages = 0
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getQuizzes.fulfilled, (state, action) => {
      state.quizzes = action.payload
      state.isLoading = false
    })
    builder.addCase(getLimitedQuizzes.fulfilled, (state, action) => {
      state.limitedQuizzes = action.payload.quizzes
      state.totalPages = action.payload.totalPages
      state.isLoading = false
    })
    builder.addCase(getOneQuiz.fulfilled, (state, action) => {
      state.oneQuiz = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizzesByCategory.fulfilled, (state, action) => {
      state.quizzes = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizzesByNotes.fulfilled, (state, action) => {
      state.quizzes = action.payload
      state.isLoading = false
    })
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.limitedQuizzes.unshift(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateQuiz.fulfilled, (state, action) => {
      state.limitedQuizzes = state.limitedQuizzes.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })
    builder.addCase(addVidLink.fulfilled, (state, action) => {
      state.limitedQuizzes = state.limitedQuizzes.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      state.limitedQuizzes = state.limitedQuizzes.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })
    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.limitedQuizzes = state.limitedQuizzes.filter(quiz => quiz._id !== action.payload._id)
      state.isLoading = false
    })
    builder.addCase(notifying.fulfilled, (state, action) => {
      state.limitedQuizzes = state.limitedQuizzes.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getLimitedQuizzes.pending, handlePending)
    builder.addCase(getQuizzes.pending, handlePending)
    builder.addCase(getOneQuiz.pending, handlePending)
    builder.addCase(getQuizzesByCategory.pending, handlePending)
    builder.addCase(getQuizzesByNotes.pending, handlePending)
    builder.addCase(createQuiz.pending, handlePending)
    builder.addCase(updateQuiz.pending, handlePending)
    builder.addCase(addVidLink.pending, handlePending)
    builder.addCase(deleteVideo.pending, handlePending)
    builder.addCase(deleteQuiz.pending, handlePending)
    builder.addCase(notifying.pending, handlePending)

    // Rejected actions
    builder.addCase(getLimitedQuizzes.rejected, handleRejected)
    builder.addCase(getQuizzes.rejected, handleRejected)
    builder.addCase(getOneQuiz.rejected, handleRejected)
    builder.addCase(getQuizzesByCategory.rejected, handleRejected)
    builder.addCase(getQuizzesByNotes.rejected, handleRejected)
    builder.addCase(createQuiz.rejected, handleRejected)
    builder.addCase(updateQuiz.rejected, handleRejected)
    builder.addCase(addVidLink.rejected, handleRejected)
    builder.addCase(deleteVideo.rejected, handleRejected)
    builder.addCase(deleteQuiz.rejected, handleRejected)
    builder.addCase(notifying.rejected, handleRejected)
  }
})

export const { clearQuizzes } = quizzesSlice.actions
export default quizzesSlice.reducer