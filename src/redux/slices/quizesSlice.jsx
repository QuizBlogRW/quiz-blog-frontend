import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getQuizes = createAsyncThunk("quizes/getQuizes", async ({ limit, skip }, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes?limit=${limit}&skip=${skip ? skip : 0}`, 'get', null, getState, dispatch, 'getQuizes'))

export const getPaginatedQuizes = createAsyncThunk("quizes/getPaginatedQuizes", async (pageNo, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/paginated/?pageNo=${pageNo}`, 'get', null, getState, dispatch, 'getPaginatedQuizes'))

export const getAllNoLimitQuizes = createAsyncThunk("quizes/getAllNoLimitQuizes", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/quizes', 'get', null, getState, dispatch, 'getAllNoLimitQuizes'))

export const getOneQuiz = createAsyncThunk("quizes/getOneQuiz", async (quizSlug, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/${quizSlug}`, 'get', null, getState, dispatch, 'getOneQuiz'))

export const getQuizesByCategory = createAsyncThunk("quizes/getQuizesByCategory", async (categoryID, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/category/${categoryID}`, 'get', null, getState, dispatch, 'getQuizesByCategory'))

export const getQuizesByNotes = createAsyncThunk("quizes/getQuizesByNotes", async (courseCategoryID, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/course-notes/${courseCategoryID}`, 'get', null, getState, dispatch, 'getQuizesByNotes'))

export const createQuiz = createAsyncThunk("quizes/createQuiz", async (newQuiz, { getState, dispatch }) =>
  apiCallHelper('/api/quizes', 'post', newQuiz, getState, dispatch, 'createQuiz'))

export const updateQuiz = createAsyncThunk("quizes/updateQuiz", async (updatedQuiz, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/${updatedQuiz.quizID}`, 'put', updatedQuiz, getState, dispatch, 'updateQuiz'))

export const addVidLink = createAsyncThunk("quizes/addVidLink", async ({ newVidLink, quizID }, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/add-video/${quizID}`, 'put', newVidLink, getState, dispatch, 'addVidLink'))

export const deleteVideo = createAsyncThunk("quizes/deleteVideo", async ({ vidData, vId }, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/delete-video/${vId}`, 'put', vidData, getState, dispatch, 'deleteVideo'))

export const deleteQuiz = createAsyncThunk("quizes/deleteQuiz", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/quizes/${id}`, 'delete', null, getState, dispatch, 'deleteQuiz'))

export const notifying = createAsyncThunk("quizes/notifying", async (newQuizInfo, { getState, dispatch }) =>
  apiCallHelper('/api/quizes/notifying', 'post', newQuizInfo, getState, dispatch, 'notifying'))

// Quizes slice
const initialState = {
  limitedQuizes: [],
  categoryQuizes: [],
  notesQuizes: [],
  isLoading: false,
  oneQuiz: '',
  allQuizesNoLimit: [],
  paginatedQuizes: [],
  totalPages: 0
}

const quizesSlice = createSlice({
  name: 'quizes',
  initialState,
  reducers: {
    clearQuizes: state => {
      state.limitedQuizes = []
      state.categoryQuizes = []
      state.notesQuizes = []
      state.isLoading = false
      state.oneQuiz = ''
      state.allQuizesNoLimit = []
      state.paginatedQuizes = []
      state.totalPages = 0
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getQuizes.fulfilled, (state, action) => {
      state.limitedQuizes = action.payload
      state.isLoading = false
    })
    builder.addCase(getPaginatedQuizes.fulfilled, (state, action) => {
      state.paginatedQuizes = action.payload.quizes
      state.totalPages = action.payload.totalPages
      state.isLoading = false
    })
    builder.addCase(getAllNoLimitQuizes.fulfilled, (state, action) => {
      state.allQuizesNoLimit = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneQuiz.fulfilled, (state, action) => {
      state.oneQuiz = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizesByCategory.fulfilled, (state, action) => {
      state.categoryQuizes = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizesByNotes.fulfilled, (state, action) => {
      state.notesQuizes = action.payload
      state.isLoading = false
    })
    builder.addCase(createQuiz.fulfilled, (state, action) => {
      state.allQuizesNoLimit.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateQuiz.fulfilled, (state, action) => {
      state.limitedQuizes = state.allQuizesNoLimit.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })
    builder.addCase(addVidLink.fulfilled, (state, action) => {
      state.limitedQuizes = state.allQuizesNoLimit.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      state.limitedQuizes = state.allQuizesNoLimit.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })
    builder.addCase(deleteQuiz.fulfilled, (state, action) => {
      state.limitedQuizes = state.allQuizesNoLimit.filter(quiz => quiz._id !== action.payload)
      state.isLoading = false
    })
    builder.addCase(notifying.fulfilled, (state, action) => {
      state.limitedQuizes = state.allQuizesNoLimit.map(quiz => quiz._id === action.payload._id ? action.payload : quiz)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getQuizes.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getOneQuiz.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getQuizesByCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getQuizesByNotes.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createQuiz.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateQuiz.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(addVidLink.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteVideo.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteQuiz.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(notifying.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getQuizes.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getOneQuiz.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getQuizesByCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getQuizesByNotes.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(createQuiz.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateQuiz.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(addVidLink.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteVideo.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteQuiz.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(notifying.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

export const { clearQuizes } = quizesSlice.actions
export default quizesSlice.reducer