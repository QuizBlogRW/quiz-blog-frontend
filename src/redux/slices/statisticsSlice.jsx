import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const get50NewUsers = createAsyncThunk("statistics/get50NewUsers", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/users50', 'get', null, getState, dispatch, 'get50NewUsers'))

export const getAllUsers = createAsyncThunk("statistics/getAllUsers", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersAll', 'get', null, getState, dispatch, 'getAllUsers'))

export const getUsersWithImage = createAsyncThunk("statistics/getUsersWithImage", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersWithImage', 'get', null, getState, dispatch, 'getUsersWithImage'))

export const getUsersWithSchool = createAsyncThunk("statistics/getUsersWithSchool", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersWithSchool', 'get', null, getState, dispatch, 'getUsersWithSchool'))

export const getUsersWithLevel = createAsyncThunk("statistics/getUsersWithLevel", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersWithLevel', 'get', null, getState, dispatch, 'getUsersWithLevel'))

export const getUsersWithFaculty = createAsyncThunk("statistics/getUsersWithFaculty", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersWithFaculty', 'get', null, getState, dispatch, 'getUsersWithFaculty'))

export const getUsersWithInterests = createAsyncThunk("statistics/getUsersWithInterests", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersWithInterests', 'get', null, getState, dispatch, 'getUsersWithInterests'))

export const getUsersWithAbout = createAsyncThunk("statistics/getUsersWithAbout", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/usersWithAbout', 'get', null, getState, dispatch, 'getUsersWithAbout'))

export const getTop100Quizzing = createAsyncThunk("statistics/getTop100Quizzing", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/top100Quizzing', 'get', null, getState, dispatch, 'getTop100Quizzing'))

export const getTop100Downloaders = createAsyncThunk("statistics/getTop100Downloaders", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/top100Downloaders', 'get', null, getState, dispatch, 'getTop100Downloaders'))

export const getTop20Quizzes = createAsyncThunk("statistics/getTop20Quizzes", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/top20Quizzes', 'get', null, getState, dispatch, 'getTop20Quizzes'))

export const getQuizzesStats = createAsyncThunk("statistics/getQuizzesStats", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/allQuizzesAttempts', 'get', null, getState, dispatch, 'getQuizzesStats'))

export const getTop20Notes = createAsyncThunk("statistics/getTop20Notes", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/top20Downloads', 'get', null, getState, dispatch, 'getTop20Notes'))

export const getNotesStats = createAsyncThunk("statistics/getNotesStats", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/allDownloads', 'get', null, getState, dispatch, 'getNotesStats'))

export const getQuizCategoriesStats = createAsyncThunk("statistics/getQuizCategoriesStats", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/quizCategoriesAttempts', 'get', null, getState, dispatch, 'getQuizCategoriesStats'))

export const getNotesCategoriesStats = createAsyncThunk("statistics/getNotesCategoriesStats", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/notesCategoriesDownloads', 'get', null, getState, dispatch, 'getNotesCategoriesStats'))

export const getDailyUserRegistration = createAsyncThunk("statistics/getDailyUserRegistration", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/statistics/dailyUserRegistration', 'get', null, getState, dispatch, 'getDailyUserRegistration'))

// Statistics slice
const initialState = {
  new50Users: [],
  isLoading: false,
  allUsers: [],
  usersWithImage: [],
  usersWithSchool: [],
  usersWithLevel: [],
  usersWithFaculty: [],
  usersWithInterests: [],
  usersWithAbout: [],
  top100Quizzing: [],
  top100Downloaders: [],
  top20Quizzes: [],
  quizzesStats: [],
  top20Notes: [],
  notesStats: [],
  quizCategoriesStats: [],
  notesCategoriesStats: [],
  dailyUserRegistration: [],
  msg: null
}

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatistics: state => {
      state.new50Users = []
      state.isLoading = false
      state.allUsers = []
      state.usersWithImage = []
      state.usersWithSchool = []
      state.usersWithLevel = []
      state.usersWithFaculty = []
      state.usersWithInterests = []
      state.usersWithAbout = []
      state.top100Quizzing = []
      state.top100Downloaders = []
      state.top20Quizzes = []
      state.quizzesStats = []
      state.top20Notes = []
      state.notesStats = []
      state.quizCategoriesStats = []
      state.notesCategoriesStats = []
      state.dailyUserRegistration = []
      state.msg = null
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(get50NewUsers.fulfilled, (state, action) => {
      state.new50Users = action.payload
      state.isLoading = false
    })
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.allUsers = action.payload
      state.isLoading = false
    })
    builder.addCase(getUsersWithImage.fulfilled, (state, action) => {
      state.usersWithImage = action.payload
      state.isLoading = false
    })
    builder.addCase(getUsersWithSchool.fulfilled, (state, action) => {
      state.usersWithSchool = action.payload
      state.isLoading = false
    })
    builder.addCase(getUsersWithLevel.fulfilled, (state, action) => {
      state.usersWithLevel = action.payload
      state.isLoading = false
    })
    builder.addCase(getUsersWithFaculty.fulfilled, (state, action) => {
      state.usersWithFaculty = action.payload
      state.isLoading = false
    })
    builder.addCase(getUsersWithInterests.fulfilled, (state, action) => {
      state.usersWithInterests = action.payload
      state.isLoading = false
    })
    builder.addCase(getUsersWithAbout.fulfilled, (state, action) => {
      state.usersWithAbout = action.payload
      state.isLoading = false
    })
    builder.addCase(getTop100Quizzing.fulfilled, (state, action) => {
      state.top100Quizzing = action.payload
      state.isLoading = false
    })
    builder.addCase(getTop100Downloaders.fulfilled, (state, action) => {
      state.top100Downloaders = action.payload
      state.isLoading = false
    })
    builder.addCase(getTop20Quizzes.fulfilled, (state, action) => {
      state.top20Quizzes = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizzesStats.fulfilled, (state, action) => {
      state.quizzesStats = action.payload
      state.isLoading = false
    })
    builder.addCase(getTop20Notes.fulfilled, (state, action) => {
      state.top20Notes = action.payload
      state.isLoading = false
    })
    builder.addCase(getNotesStats.fulfilled, (state, action) => {
      state.notesStats = action.payload
      state.isLoading = false
    })
    builder.addCase(getQuizCategoriesStats.fulfilled, (state, action) => {
      state.quizCategoriesStats = action.payload
      state.isLoading = false
    })
    builder.addCase(getNotesCategoriesStats.fulfilled, (state, action) => {
      state.notesCategoriesStats = action.payload
      state.isLoading = false
    })
    builder.addCase(getDailyUserRegistration.fulfilled, (state, action) => {
      state.dailyUserRegistration = action.payload
      state.isLoading = false
    })

    // Rejected actions
    builder.addCase(get50NewUsers.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getAllUsers.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUsersWithImage.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUsersWithSchool.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUsersWithLevel.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUsersWithFaculty.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUsersWithInterests.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUsersWithAbout.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getTop100Quizzing.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getTop100Downloaders.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getTop20Quizzes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getQuizzesStats.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getTop20Notes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getNotesStats.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getQuizCategoriesStats.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getNotesCategoriesStats.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getDailyUserRegistration.rejected, state => {
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(get50NewUsers.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getAllUsers.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUsersWithImage.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUsersWithSchool.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUsersWithLevel.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUsersWithFaculty.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUsersWithInterests.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUsersWithAbout.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getTop100Quizzing.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getTop100Downloaders.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getTop20Quizzes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getQuizzesStats.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getTop20Notes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getNotesStats.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getQuizCategoriesStats.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getNotesCategoriesStats.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getDailyUserRegistration.pending, state => {
      state.isLoading = true
    })

  }
})

export const { clearStatistics } = statisticsSlice.actions
export default statisticsSlice.reducer