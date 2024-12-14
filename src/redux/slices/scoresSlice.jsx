import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const setScores = createAsyncThunk("scores/setScores", async (pageNo, { getState }) =>
  apiCallHelper(`/api/scores?pageNo=${pageNo}`, 'get', null, getState, 'setScores'))

export const setRankingScores = createAsyncThunk("scores/setRankingScores", async (quizID, { getState }) =>
  apiCallHelper(`/api/scores/ranking/${quizID}`, 'get', null, getState, 'setRankingScores'))

export const getTakerScores = createAsyncThunk("scores/getTakerScores", async (takerId, { getState }) =>
  apiCallHelper(`/api/scores/taken-by/${takerId}`, 'get', null, getState, 'getTakerScores'))

export const getCreatorScores = createAsyncThunk("scores/getCreatorScores", async (uId, { getState }) =>
  apiCallHelper(`/api/scores/quiz-creator/${uId}`, 'get', null, getState, 'getCreatorScores'))

export const getOneScore = createAsyncThunk("scores/getOneScore", async (scoreId, { getState }) =>
  apiCallHelper(`/api/scores/one-score/${scoreId}`, 'get', null, getState, 'getOneScore'))

export const getPopularToday = createAsyncThunk("scores/getPopularToday", async (_, { getState }) =>
  apiCallHelper('/api/scores/popular-quizes', 'get', null, getState, 'getPopularToday'))

export const getUserOfMonth = createAsyncThunk("scores/getUserOfMonth", async (_, { getState }) =>
  apiCallHelper('/api/scores/monthly-user', 'get', null, getState, 'getUserOfMonth'))

export const createScore = createAsyncThunk("scores/createScore", async (newScore, { getState }) =>
  apiCallHelper('/api/scores', 'post', newScore, getState, 'createScore'))

export const updateScore = createAsyncThunk("scores/updateScore", async (updatedScore, { getState }) =>
  apiCallHelper(`/api/scores/${updatedScore.sId}`, 'put', updatedScore, getState, 'updateScore'))

export const deleteScore = createAsyncThunk("scores/deleteScore", async (id, { getState }) =>
  apiCallHelper(`/api/scores/${id}`, 'delete', null, getState, 'deleteScore'))

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
  isLoading: false,
  error: null
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
    builder.addMatcher(
      (action) => [setScores.pending, setRankingScores.pending, getTakerScores.pending, getCreatorScores.pending, getOneScore.pending, getPopularToday.pending, getUserOfMonth.pending, createScore.pending, updateScore.pending, deleteScore.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [setScores.rejected, setRankingScores.rejected, getTakerScores.rejected, getCreatorScores.rejected, getOneScore.rejected, getPopularToday.rejected, getUserOfMonth.rejected, createScore.rejected, updateScore.rejected, deleteScore.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })

  }
})

export const { clearScores } = scoresSlice.actions
export default scoresSlice.reducer