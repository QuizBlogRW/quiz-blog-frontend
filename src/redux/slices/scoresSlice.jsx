import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const setScores = createAsyncThunk("scores/setScores", async (pageNo, { getState, dispatch }) =>
  apiCallHelper(`/api/scores?pageNo=${pageNo}`, 'get', null, getState, dispatch, 'setScores'))

export const setRankingScores = createAsyncThunk("scores/setRankingScores", async (quizID, { getState, dispatch }) =>
  apiCallHelper(`/api/scores/ranking/${quizID}`, 'get', null, getState, dispatch, 'setRankingScores'))

export const getTakerScores = createAsyncThunk("scores/getTakerScores", async (takerId, { getState, dispatch }) =>
  apiCallHelper(`/api/scores/taken-by/${takerId}`, 'get', null, getState, dispatch, 'getTakerScores'))

export const getCreatorScores = createAsyncThunk("scores/getCreatorScores", async (uId, { getState, dispatch }) =>
  apiCallHelper(`/api/scores/quiz-creator/${uId}`, 'get', null, getState, dispatch, 'getCreatorScores'))

export const getOneScore = createAsyncThunk("scores/getOneScore", async (scoreId, { getState, dispatch }) =>
  apiCallHelper(`/api/scores/one-score/${scoreId}`, 'get', null, getState, dispatch, 'getOneScore'))

export const getPopularToday = createAsyncThunk("scores/getPopularToday", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/scores/popular-quizes', 'get', null, getState, dispatch, 'getPopularToday'))

export const getUserOfMonth = createAsyncThunk("scores/getUserOfMonth", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/scores/monthly-user', 'get', null, getState, dispatch, 'getUserOfMonth'))

export const createScore = createAsyncThunk("scores/createScore", async (newScore, { getState, dispatch }) =>
  apiCallHelper('/api/scores', 'post', newScore, getState, dispatch, 'createScore'))

export const updateScore = createAsyncThunk("scores/updateScore", async (updatedScore, { getState, dispatch }) =>
  apiCallHelper(`/api/scores/${updatedScore.sId}`, 'put', updatedScore, getState, dispatch, 'updateScore'))

export const deleteScore = createAsyncThunk("scores/deleteScore", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/scores/${id}`, 'delete', null, getState, dispatch, 'deleteScore'))

// Scores slice
const initialState = {
  allScores: [],
  totalPages: 0,
  oneScore: '',
  monthlyUser: '',
  takerScores: [],
  rankingScores: [],
  creatorScores: [],
  popularQuizes: [],
  feedbacks: [],
  isLoading: false
}

const scoresSlice = createSlice({
  name: 'scores',
  initialState,
  reducers: {
    clearScores: state => {
      state.allScores = []
      state.totalPages = 0
      state.oneScore = ''
      state.monthlyUser = ''
      state.takerScores = []
      state.rankingScores = []
      state.creatorScores = []
      state.popularQuizes = []
      state.feedbacks = []
      state.isLoading = false
    },
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(setScores.fulfilled, (state, action) => {
      state.allScores = action.payload.scores
      state.totalPages = action.payload.totalPages
      state.isLoading = false
    })
    builder.addCase(setRankingScores.fulfilled, (state, action) => {
      state.rankingScores = action.payload
      state.isLoading = false
    })
    builder.addCase(getTakerScores.fulfilled, (state, action) => {
      state.takerScores = action.payload
      state.isLoading = false
    })
    builder.addCase(getCreatorScores.fulfilled, (state, action) => {
      state.creatorScores = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneScore.fulfilled, (state, action) => {
      state.oneScore = action.payload
      state.isLoading = false
    })
    builder.addCase(getPopularToday.fulfilled, (state, action) => {
      state.popularQuizes = action.payload
      state.isLoading = false
    })
    builder.addCase(getUserOfMonth.fulfilled, (state, action) => {
      state.monthlyUser = action.payload
      state.isLoading = false
    })
    builder.addCase(createScore.fulfilled, (state, action) => {
      state.allScores.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateScore.fulfilled, (state, action) => {
      state.allScores = state.allScores.map(score => score._id === action.payload._id ? action.payload : score)
      state.isLoading = false
    })
    builder.addCase(deleteScore.fulfilled, (state, action) => {
      state.allScores = state.allScores.filter(score => score._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(setScores.pending, state => {
      state.isLoading = true
    })
    builder.addCase(setRankingScores.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getTakerScores.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getCreatorScores.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneScore.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getPopularToday.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUserOfMonth.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createScore.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateScore.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteScore.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(setScores.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(setRankingScores.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getTakerScores.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getCreatorScores.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneScore.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getPopularToday.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUserOfMonth.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createScore.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateScore.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteScore.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearScores } = scoresSlice.actions
export default scoresSlice.reducer