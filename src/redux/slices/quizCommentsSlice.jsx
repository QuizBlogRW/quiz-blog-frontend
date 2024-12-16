import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, handlePending, handleRejected } from '../configHelpers'

// Async actions with createAsyncThunk
export const getAllComments = createAsyncThunk("quizComments/getAllComments", async (_, { getState }) =>
  apiCallHelper('/api/quizzes-comments', 'get', null, getState, 'getAllComments'))

export const getQuizComments = createAsyncThunk("quizComments/getQuizComments", async (quizID, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/quiz/${quizID}`, 'get', null, getState, 'getQuizComments'))

export const getOneComment = createAsyncThunk("quizComments/getOneComment", async (commentId, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/${commentId}`, 'get', null, getState, 'getOneComment'))

export const createComment = createAsyncThunk("quizComments/createComment", async (newComment, { getState }) =>
  apiCallHelper('/api/quizzes-comments', 'post', newComment, getState, 'createComment'))

export const updateComment = createAsyncThunk("quizComments/updateComment", async (updatedComment, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/${updatedComment.commentID}`, 'put', updatedComment, getState, 'updateComment'))

export const deleteComment = createAsyncThunk("quizComments/deleteComment", async (commentId, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/${commentId}`, 'delete', null, getState, 'deleteComment'))


// Quiz Comments slice
const initialState = {
  allComments: [],
  isLoading: false,
  oneComment: '',
  quizCmnts: [],
  error: null
}

const quizCommentsSlice = createSlice({
  name: 'quizComments',
  initialState,
  reducers: {},

  extraReducers: (builder) => {

    // Fulfilled actions
    builder.addCase(getAllComments.fulfilled, (state, action) => {
      state.allComments = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizComments.fulfilled, (state, action) => {
      state.quizCmnts = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneComment.fulfilled, (state, action) => {
      state.oneComment = action.payload
      state.isLoading = false
    })
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.allComments.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateComment.fulfilled, (state, action) => {
      state.allComments = state.allComments.map(comment => comment._id === action.payload._id ? action.payload : comment)
      state.isLoading = false
    })
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.allComments = state.allComments.filter(comment => comment._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getAllComments.pending, handlePending)
    builder.addCase(getQuizComments.pending, handlePending)
    builder.addCase(getOneComment.pending, handlePending)
    builder.addCase(createComment.pending, handlePending)
    builder.addCase(updateComment.pending, handlePending)
    builder.addCase(deleteComment.pending, handlePending)

    // Rejected actions
    builder.addCase(getAllComments.rejected, handleRejected)
    builder.addCase(getQuizComments.rejected, handleRejected)
    builder.addCase(getOneComment.rejected, handleRejected)
    builder.addCase(createComment.rejected, handleRejected)
    builder.addCase(updateComment.rejected, handleRejected)
    builder.addCase(deleteComment.rejected, handleRejected)
  }
})

export default quizCommentsSlice.reducer
