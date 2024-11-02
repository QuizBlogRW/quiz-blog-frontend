import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const get50NewUsers = createAsyncThunk("statistics/get50NewUsers", async (_, { getState }) =>
  apiCallHelper('/api/statistics/users50', 'get', null, getState, 'get50NewUsers'))

export const getAllUsers = createAsyncThunk("statistics/getAllUsers", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersAll', 'get', null, getState, 'getAllUsers'))

export const getUsersWithImage = createAsyncThunk("statistics/getUsersWithImage", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersWithImage', 'get', null, getState, 'getUsersWithImage'))

export const getUsersWithSchool = createAsyncThunk("statistics/getUsersWithSchool", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersWithSchool', 'get', null, getState, 'getUsersWithSchool'))

export const getUsersWithLevel = createAsyncThunk("statistics/getUsersWithLevel", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersWithLevel', 'get', null, getState, 'getUsersWithLevel'))

export const getUsersWithFaculty = createAsyncThunk("statistics/getUsersWithFaculty", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersWithFaculty', 'get', null, getState, 'getUsersWithFaculty'))

export const getUsersWithInterests = createAsyncThunk("statistics/getUsersWithInterests", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersWithInterests', 'get', null, getState, 'getUsersWithInterests'))

export const getUsersWithAbout = createAsyncThunk("statistics/getUsersWithAbout", async (_, { getState }) =>
  apiCallHelper('/api/statistics/usersWithAbout', 'get', null, getState, 'getUsersWithAbout'))

export const getTop100Quizzing = createAsyncThunk("statistics/getTop100Quizzing", async (_, { getState }) =>
  apiCallHelper('/api/statistics/top100Quizzing', 'get', null, getState, 'getTop100Quizzing'))

export const getTop100Downloaders = createAsyncThunk("statistics/getTop100Downloaders", async (_, { getState }) =>
  apiCallHelper('/api/statistics/top100Downloaders', 'get', null, getState, 'getTop100Downloaders'))

export const getTop20Quizzes = createAsyncThunk("statistics/getTop20Quizzes", async (_, { getState }) =>
  apiCallHelper('/api/statistics/top20Quizzes', 'get', null, getState, 'getTop20Quizzes'))

export const getQuizzesStats = createAsyncThunk("statistics/getQuizzesStats", async (_, { getState }) =>
  apiCallHelper('/api/statistics/allQuizzesAttempts', 'get', null, getState, 'getQuizzesStats'))

export const getTop20Notes = createAsyncThunk("statistics/getTop20Notes", async (_, { getState }) =>
  apiCallHelper('/api/statistics/top20Downloads', 'get', null, getState, 'getTop20Notes'))

export const getNotesStats = createAsyncThunk("statistics/getNotesStats", async (_, { getState }) =>
  apiCallHelper('/api/statistics/allDownloads', 'get', null, getState, 'getNotesStats'))

export const getQuizCategoriesStats = createAsyncThunk("statistics/getQuizCategoriesStats", async (_, { getState }) =>
  apiCallHelper('/api/statistics/quizCategoriesAttempts', 'get', null, getState, 'getQuizCategoriesStats'))

export const getNotesCategoriesStats = createAsyncThunk("statistics/getNotesCategoriesStats", async (_, { getState }) =>
  apiCallHelper('/api/statistics/notesCategoriesDownloads', 'get', null, getState, 'getNotesCategoriesStats'))

export const getDailyUserRegistration = createAsyncThunk("statistics/getDailyUserRegistration", async (_, { getState }) =>
  apiCallHelper('/api/statistics/dailyUserRegistration', 'get', null, getState, 'getDailyUserRegistration'))

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

    // Pending actions
    builder.addMatcher(
      (action) => [get50NewUsers.pending, getAllUsers.pending, getUsersWithImage.pending, getUsersWithSchool.pending, getUsersWithLevel.pending, getUsersWithFaculty.pending, getUsersWithInterests.pending, getUsersWithAbout.pending, getTop100Quizzing.pending, getTop100Downloaders.pending, getTop20Quizzes.pending, getQuizzesStats.pending, getTop20Notes.pending, getNotesStats.pending, getQuizCategoriesStats.pending, getNotesCategoriesStats.pending, getDailyUserRegistration.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [get50NewUsers.rejected, getAllUsers.rejected, getUsersWithImage.rejected, getUsersWithSchool.rejected, getUsersWithLevel.rejected, getUsersWithFaculty.rejected, getUsersWithInterests.rejected, getUsersWithAbout.rejected, getTop100Quizzing.rejected, getTop100Downloaders.rejected, getTop20Quizzes.rejected, getQuizzesStats.rejected, getTop20Notes.rejected, getNotesStats.rejected, getQuizCategoriesStats.rejected, getNotesCategoriesStats.rejected, getDailyUserRegistration.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearStatistics } = statisticsSlice.actions
export default statisticsSlice.reducer