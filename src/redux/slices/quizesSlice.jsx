import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getQuizes = createAsyncThunk("quizes/getQuizes", async ({ limit, skip }, { getState }) =>
  apiCallHelper(`/api/quizes?limit=${limit}&skip=${skip ? skip : 0}`, 'get', null, getState, 'getQuizes'))

export const getPaginatedQuizes = createAsyncThunk("quizes/getPaginatedQuizes", async (pageNo, { getState }) =>
  apiCallHelper(`/api/quizes/paginated/?pageNo=${pageNo}`, 'get', null, getState, 'getPaginatedQuizes'))

export const getAllNoLimitQuizes = createAsyncThunk("quizes/getAllNoLimitQuizes", async (_, { getState }) =>
  apiCallHelper('/api/quizes', 'get', null, getState, 'getAllNoLimitQuizes'))

export const getOneQuiz = createAsyncThunk("quizes/getOneQuiz", async (quizSlug, { getState }) =>
  apiCallHelper(`/api/quizes/${quizSlug}`, 'get', null, getState, 'getOneQuiz'))

export const getQuizesByCategory = createAsyncThunk("quizes/getQuizesByCategory", async (categoryID, { getState }) =>
  apiCallHelper(`/api/quizes/category/${categoryID}`, 'get', null, getState, 'getQuizesByCategory'))

export const getQuizesByNotes = createAsyncThunk("quizes/getQuizesByNotes", async (courseCategoryID, { getState }) =>
  apiCallHelper(`/api/quizes/course-notes/${courseCategoryID}`, 'get', null, getState, 'getQuizesByNotes'))

export const createQuiz = createAsyncThunk("quizes/createQuiz", async (newQuiz, { getState }) =>
  apiCallHelper('/api/quizes', 'post', newQuiz, getState, 'createQuiz'))

export const updateQuiz = createAsyncThunk("quizes/updateQuiz", async (updatedQuiz, { getState }) =>
  apiCallHelper(`/api/quizes/${updatedQuiz.quizID}`, 'put', updatedQuiz, getState, 'updateQuiz'))

export const addVidLink = createAsyncThunk("quizes/addVidLink", async ({ newVidLink, quizID }, { getState }) =>
  apiCallHelper(`/api/quizes/add-video/${quizID}`, 'put', newVidLink, getState, 'addVidLink'))

export const deleteVideo = createAsyncThunk("quizes/deleteVideo", async ({ vidData, vId }, { getState }) =>
  apiCallHelper(`/api/quizes/delete-video/${vId}`, 'put', vidData, getState, 'deleteVideo'))

export const deleteQuiz = createAsyncThunk("quizes/deleteQuiz", async (id, { getState }) =>
  apiCallHelper(`/api/quizes/${id}`, 'delete', null, getState, 'deleteQuiz'))

export const notifying = createAsyncThunk("quizes/notifying", async (newQuizInfo, { getState }) =>
  apiCallHelper('/api/quizes/notifying', 'post', newQuizInfo, getState, 'notifying'))

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
    builder.addMatcher(
      (action) => [getQuizes.pending, getPaginatedQuizes.pending, getAllNoLimitQuizes.pending, getOneQuiz.pending, getQuizesByCategory.pending, getQuizesByNotes.pending, createQuiz.pending, updateQuiz.pending, addVidLink.pending, deleteVideo.pending, deleteQuiz.pending, notifying.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getQuizes.rejected, getPaginatedQuizes.rejected, getAllNoLimitQuizes.rejected, getOneQuiz.rejected, getQuizesByCategory.rejected, getQuizesByNotes.rejected, createQuiz.rejected, updateQuiz.rejected, addVidLink.rejected, deleteVideo.rejected, deleteQuiz.rejected, notifying.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearQuizes } = quizesSlice.actions
export default quizesSlice.reducer