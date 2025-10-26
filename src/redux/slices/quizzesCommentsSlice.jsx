import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCallHelper } from '../configHelpers';

// Async actions with createAsyncThunk
export const getAllQuizzesComments = createAsyncThunk('quizzesComments/getAllQuizzesComments', async (_, { getState }) =>
  apiCallHelper('/api/quizzes-comments', 'get', null, getState, 'getAllQuizzesComments'));

export const getOneQuizComments = createAsyncThunk('quizzesComments/getOneQuizComments', async (quizID, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/quiz/${quizID}`, 'get', null, getState, 'getOneQuizComments'));

export const getOneComment = createAsyncThunk('quizzesComments/getOneComment', async (commentId, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/${commentId}`, 'get', null, getState, 'getOneComment'));

export const createComment = createAsyncThunk('quizzesComments/createComment', async (newComment, { getState }) =>
  apiCallHelper('/api/quizzes-comments', 'post', newComment, getState, 'createComment'));

export const approveRejectComment = createAsyncThunk('quizzesComments/approveRejectComment', async ({ commentID, status }, { getState }) =>
  apiCallHelper(`/api/questions-comments/approve-reject/${commentID}`, 'put', status, getState, 'approveRejectComment'));

export const deleteComment = createAsyncThunk('quizzesComments/deleteComment', async (commentId, { getState }) =>
  apiCallHelper(`/api/quizzes-comments/${commentId}`, 'delete', null, getState, 'deleteComment'));


// Quiz Comments slice
const initialState = {
  allQuizzesComments: [],
  isLoading: {
    allQuizzesComments: false,
    quizzesComments: false,
    oneComment: false,
  },
  oneComment: '',
  oneQuizComments: [],
  error: null
};

// Helper function to handle fulfilled cases
const handleFulfilled = (state, action, key) => {
  state[key] = action.payload;
  state.isLoading[key] = false;
};

// Helper function to handle pending cases
const handlePending = (state, key) => {
  state.isLoading[key] = true;
};

// Helper function to handle rejected cases
const handleRejected = (state, action, key) => {
  state.isLoading[key] = false;
  state.error = action.error.message;
};

const quizzesCommentsSlice = createSlice({
  name: 'quizzesComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllQuizzesComments.pending, (state) => handlePending(state, 'allQuizzesComments'))
      .addCase(getAllQuizzesComments.fulfilled, (state, action) => handleFulfilled(state, action, 'allQuizzesComments'))
      .addCase(getAllQuizzesComments.rejected, (state, action) => handleRejected(state, action, 'allQuizzesComments'))

      .addCase(getOneQuizComments.pending, (state) => handlePending(state, 'oneQuizComments'))
      .addCase(getOneQuizComments.fulfilled, (state, action) => handleFulfilled(state, action, 'oneQuizComments'))
      .addCase(getOneQuizComments.rejected, (state, action) => handleRejected(state, action, 'oneQuizComments'))

      .addCase(getOneComment.pending, (state) => handlePending(state, 'oneComment'))
      .addCase(getOneComment.fulfilled, (state, action) => handleFulfilled(state, action, 'oneComment'))
      .addCase(getOneComment.rejected, (state, action) => handleRejected(state, action, 'oneComment'))

      .addCase(createComment.pending, (state) => handlePending(state, 'comment'))
      .addCase(createComment.fulfilled, (state, action) => handleFulfilled(state, action, 'comment'))
      .addCase(createComment.rejected, (state, action) => handleRejected(state, action, 'comment'))

      .addCase(approveRejectComment.pending, (state) => handlePending(state, 'comment'))
      .addCase(approveRejectComment.fulfilled, (state, action) => handleFulfilled(state, action, 'comment'))
      .addCase(approveRejectComment.rejected, (state, action) => handleRejected(state, action, 'comment'))

      .addCase(deleteComment.pending, (state) => handlePending(state, 'comment'))
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.allQuizzesComments = state.allQuizzesComments.filter(comment => comment._id !== action.payload._id);
        state.isLoading.allQuizzesComments = false;
      })
      .addCase(deleteComment.rejected, (state, action) => handleRejected(state, action, 'comment'));
  }
});

export default quizzesCommentsSlice.reducer;
