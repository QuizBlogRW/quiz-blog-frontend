import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getAllComments = createAsyncThunk("quizComments/getAllComments", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/quizComments', 'get', null, getState, dispatch, 'getAllComments'))

export const getQuizComments = createAsyncThunk("quizComments/getQuizComments", async (quizID, { getState, dispatch }) =>
  apiCallHelper(`/api/quizComments/comments-on/${quizID}`, 'get', null, getState, dispatch, 'getQuizComments'))

export const getOneComment = createAsyncThunk("quizComments/getOneComment", async (commentId, { getState, dispatch }) =>
  apiCallHelper(`/api/quizComments/${commentId}`, 'get', null, getState, dispatch, 'getOneComment'))

export const createComment = createAsyncThunk("quizComments/createComment", async (newComment, { getState, dispatch }) =>
  apiCallHelper('/api/quizComments', 'post', newComment, getState, dispatch, 'createComment'))

export const updateComment = createAsyncThunk("quizComments/updateComment", async (updatedComment, { getState, dispatch }) =>
  apiCallHelper(`/api/quizComments/${updatedComment.commentID}`, 'put', updatedComment, getState, dispatch, 'updateComment'))

export const deleteComment = createAsyncThunk("quizComments/deleteComment", async (commentId, { getState, dispatch }) =>
  apiCallHelper(`/api/quizComments/${commentId}`, 'delete', null, getState, dispatch, 'deleteComment'))


// Quiz Comments slice
const initialState = {
  allComments: [],
  isLoading: false,
  oneComment: '',
  quizCmnts: []
}

const quizCommentsSlice = createSlice({
  name: 'quizComments',
  initialState,
  reducers: {
    commentsLoading: state => {
      state.isLoading = false
    }
  },
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
    builder.addCase(getAllComments.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getQuizComments.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneComment.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createComment.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateComment.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteComment.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getAllComments.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getQuizComments.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneComment.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createComment.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateComment.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteComment.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { commentsLoading } = quizCommentsSlice.actions
export default quizCommentsSlice.reducer