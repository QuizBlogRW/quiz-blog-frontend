import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getComments = createAsyncThunk("questionComments/getComments", async (_, { getState }) =>
  apiCallHelper('/api/questions-comments', 'get', null, getState, 'getComments'))

export const getPaginatedComments = createAsyncThunk("questionComments/getPaginatedComments", async (pageNo, { getState }) =>
  apiCallHelper(`/api/questions-comments/paginated/?pageNo=${pageNo}`, 'get', null, getState, 'getPaginatedComments'))

export const getPendingComments = createAsyncThunk("questionComments/getPendingComments", async (_, { getState }) =>
  apiCallHelper(`/api/questions-comments/pending`, 'get', null, getState, 'getPendingComments'))

export const getCommentsByQuiz = createAsyncThunk("questionComments/getCommentsByQuiz", async (quizID, { getState }) =>
  apiCallHelper(`/api/questions-comments/quiz/${quizID}`, 'get', null, getState, 'getCommentsByQuiz'))

export const getQuestionComments = createAsyncThunk("questionComments/getQuestionComments", async (questionID, { getState }) =>
  apiCallHelper(`/api/questions-comments/comments-on/${questionID}`, 'get', null, getState, 'getQuestionComments'))

export const getOneComment = createAsyncThunk("questionComments/getOneComment", async (commentId, { getState }) =>
  apiCallHelper(`/api/questions-comments/${commentId}`, 'get', null, getState, 'getOneComment'))

export const createComment = createAsyncThunk("questionComments/createComment", async (newComment, { getState }) =>
  apiCallHelper('/api/questions-comments', 'post', newComment, getState, 'createComment'))

export const updateComment = createAsyncThunk("questionComments/updateComment", async (updatedComment, { getState }) =>
  apiCallHelper(`/api/questions-comments/${updatedComment.commentID}`, 'put', updatedComment, getState, 'updateComment'))

export const approveComment = createAsyncThunk("questionComments/approveComment", async (approvedComment, { getState }) =>
  apiCallHelper(`/api/questions-comments/approve/${approvedComment.commentID}`, 'put', approvedComment, getState, 'approveComment'))

export const rejectComment = createAsyncThunk("questionComments/rejectComment", async (rejectedComment, { getState }) =>
  apiCallHelper(`/api/questions-comments/reject/${rejectedComment.commentID}`, 'put', rejectedComment, getState, 'rejectComment'))

export const deleteComment = createAsyncThunk("questionComments/deleteComment", async (id, { getState }) =>
  apiCallHelper(`/api/comments/${id}`, 'delete', null, getState, 'deleteComment'))

// QuestionComments slice
const initialState = {
  allComments: [],
  commentsByQuiz: [],
  isLoading: false,
  oneComment: '',
  questionComments: [],
  paginatedComments: [],
  pendingComments: [],
  error: null
}

const questionCommentsSlice = createSlice({
  name: 'questionComments',
  initialState,
  reducers: {
    clearComments: state => {
      state.allComments = []
      state.isLoading = false
    },
    clearCommentsByQuiz: state => {
      state.commentsByQuiz = []
      state.isLoading = false
    },
    clearOneComment: state => {
      state.oneComment = ''
    },
    clearQuestionComments: state => {
      state.questionComments = []
    },
    clearPaginatedComments: state => {
      state.paginatedComments = []
      state.isLoading = false
    },
    clearPendingComments: state => {
      state.pendingComments = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getComments.fulfilled, (state, action) => {
      state.allComments = action.payload
      state.isLoading = false
    })
    builder.addCase(getPaginatedComments.fulfilled, (state, action) => {
      state.paginatedComments = action.payload
      state.isLoading = false
    })
    builder.addCase(getPendingComments.fulfilled, (state, action) => {
      state.pendingComments = action.payload
      state.isLoading = false
    })
    builder.addCase(getCommentsByQuiz.fulfilled, (state, action) => {
      state.commentsByQuiz = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuestionComments.fulfilled, (state, action) => {
      state.questionComments = action.payload
    })
    builder.addCase(getOneComment.fulfilled, (state, action) => {
      state.oneComment = action.payload
    })
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.allComments.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateComment.fulfilled, (state, action) => {
      state.allComments = state.allComments.map(comment => comment._id === action.payload._id ? action.payload : comment)
      state.isLoading = false
    })
    builder.addCase(approveComment.fulfilled, (state, action) => {
      state.allComments = state.allComments.map(comment => comment._id === action.payload._id ? action.payload : comment)
      state.isLoading = false
    })
    builder.addCase(rejectComment.fulfilled, (state, action) => {
      state.allComments = state.allComments.map(comment => comment._id === action.payload._id ? action.payload : comment)
      state.isLoading = false
    })
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.allComments = state.allComments.filter(comment => comment._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addMatcher(
      (action) => [getComments.pending, getPaginatedComments.pending, getPendingComments.pending, getCommentsByQuiz.pending, getQuestionComments.pending, getOneComment.pending, createComment.pending, updateComment.pending, approveComment.pending, rejectComment.pending, deleteComment.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getComments.rejected, getPaginatedComments.rejected, getPendingComments.rejected, getCommentsByQuiz.rejected, getQuestionComments.rejected, getOneComment.rejected, createComment.rejected, updateComment.rejected, approveComment.rejected, rejectComment.rejected, deleteComment.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearComments, clearCommentsByQuiz, clearOneComment, clearQuestionComments, clearPaginatedComments, clearPendingComments } = questionCommentsSlice.actions
export default questionCommentsSlice.reducer