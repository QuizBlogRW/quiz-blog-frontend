import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getAllComments = createAsyncThunk("quizComments/getAllComments", async (_, { getState }) =>
  apiCallHelper('/api/quizzes-comments', 'get', null, getState, 'getAllComments'))

export const getQuizComments = createAsyncThunk("quizComments/getQuizComments", async (quizID, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/comments-on/${quizID}`, 'get', null, getState, 'getQuizComments'))

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
    builder.addMatcher(
      (action) => [getAllComments.pending, getQuizComments.pending, getOneComment.pending, createComment.pending, updateComment.pending, deleteComment.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getAllComments.rejected, getQuizComments.rejected, getOneComment.rejected, createComment.rejected, updateComment.rejected, deleteComment.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })

  }
})

export const { commentsLoading } = quizCommentsSlice.actions
export default quizCommentsSlice.reducer