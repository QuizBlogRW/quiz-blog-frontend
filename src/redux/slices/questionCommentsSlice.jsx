import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getComments = createAsyncThunk("questionComments/getComments", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/questionComments', 'get', null, getState, dispatch, 'getComments'))

export const getPaginatedComments = createAsyncThunk("questionComments/getPaginatedComments", async (pageNo, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/paginated/?pageNo=${pageNo}`, 'get', null, getState, dispatch, 'getPaginatedComments'))

export const getPendingComments = createAsyncThunk("questionComments/getPendingComments", async (_, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/pending`, 'get', null, getState, dispatch, 'getPendingComments'))

export const getCommentsByQuiz = createAsyncThunk("questionComments/getCommentsByQuiz", async (quizID, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/quiz/${quizID}`, 'get', null, getState, dispatch, 'getCommentsByQuiz'))

export const getQuestionComments = createAsyncThunk("questionComments/getQuestionComments", async (questionID, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/comments-on/${questionID}`, 'get', null, getState, dispatch, 'getQuestionComments'))

export const getOneComment = createAsyncThunk("questionComments/getOneComment", async (commentId, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/${commentId}`, 'get', null, getState, dispatch, 'getOneComment'))

export const createComment = createAsyncThunk("questionComments/createComment", async (newComment, { getState, dispatch }) =>
  apiCallHelper('/api/questionComments', 'post', newComment, getState, dispatch, 'createComment'))

export const updateComment = createAsyncThunk("questionComments/updateComment", async (updatedComment, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/${updatedComment.commentID}`, 'put', updatedComment, getState, dispatch, 'updateComment'))

export const approveComment = createAsyncThunk("questionComments/approveComment", async (approvedComment, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/approve/${approvedComment.commentID}`, 'put', approvedComment, getState, dispatch, 'approveComment'))

export const rejectComment = createAsyncThunk("questionComments/rejectComment", async (rejectedComment, { getState, dispatch }) =>
  apiCallHelper(`/api/questionComments/reject/${rejectedComment.commentID}`, 'put', rejectedComment, getState, dispatch, 'rejectComment'))

export const deleteComment = createAsyncThunk("questionComments/deleteComment", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/comments/${id}`, 'delete', null, getState, dispatch, 'deleteComment'))

// QuestionComments slice
const initialState = {
  allComments: [],
  commentsByQuiz: [],
  isLoading: false,
  oneComment: '',
  questionComments: [],
  paginatedComments: [],
  pendingComments: []
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
    builder.addCase(getComments.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getPaginatedComments.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getPendingComments.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getCommentsByQuiz.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getQuestionComments.pending, state => {
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
    builder.addCase(approveComment.pending, state => {
      state.isLoading = true
    })
    builder.addCase(rejectComment.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteComment.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getComments.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getPaginatedComments.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getPendingComments.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getCommentsByQuiz.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getQuestionComments.rejected, state => {
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
    builder.addCase(approveComment.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(rejectComment.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteComment.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearComments, clearCommentsByQuiz, clearOneComment, clearQuestionComments, clearPaginatedComments, clearPendingComments } = questionCommentsSlice.actions
export default questionCommentsSlice.reducer