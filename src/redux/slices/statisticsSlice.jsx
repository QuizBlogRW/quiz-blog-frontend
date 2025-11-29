import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCallHelper, handlePending, handleRejected } from '../configHelpers';

// Async actions with createAsyncThunk
export const get50NewUsers = createAsyncThunk('statistics/get50NewUsers', async (_, { getState }) =>
  apiCallHelper('/api/statistics/50-new-users', 'get', null, getState, 'get50NewUsers'));

export const getAllUsers = createAsyncThunk('statistics/getAllUsers', async (_, { getState }) =>
  apiCallHelper('/api/statistics/all-users', 'get', null, getState, 'getAllUsers'));

export const getUsersWithImage = createAsyncThunk('statistics/getUsersWithImage', async (_, { getState }) =>
  apiCallHelper('/api/statistics/users-with-image', 'get', null, getState, 'getUsersWithImage'));

export const getUsersWithSchool = createAsyncThunk('statistics/getUsersWithSchool', async (_, { getState }) =>
  apiCallHelper('/api/statistics/users-with-school', 'get', null, getState, 'getUsersWithSchool'));

export const getUsersWithLevel = createAsyncThunk('statistics/getUsersWithLevel', async (_, { getState }) =>
  apiCallHelper('/api/statistics/users-with-level', 'get', null, getState, 'getUsersWithLevel'));

export const getUsersWithFaculty = createAsyncThunk('statistics/getUsersWithFaculty', async (_, { getState }) =>
  apiCallHelper('/api/statistics/users-with-faculty', 'get', null, getState, 'getUsersWithFaculty'));

export const getUsersWithInterests = createAsyncThunk('statistics/getUsersWithInterests', async (_, { getState }) =>
  apiCallHelper('/api/statistics/users-with-interests', 'get', null, getState, 'getUsersWithInterests'));

export const getUsersWithAbout = createAsyncThunk('statistics/getUsersWithAbout', async (_, { getState }) =>
  apiCallHelper('/api/statistics/users-with-about', 'get', null, getState, 'getUsersWithAbout'));

export const getTop10QuizzingUsers = createAsyncThunk('statistics/getTop10QuizzingUsers', async (_, { getState }) =>
  apiCallHelper('/api/statistics/top-10-quizzing-users', 'get', null, getState, 'getTop10QuizzingUsers'));

export const getTop10Downloaders = createAsyncThunk('statistics/getTop10Downloaders', async (_, { getState }) =>
  apiCallHelper('/api/statistics/top-10-downloaders', 'get', null, getState, 'getTop10Downloaders'));

export const getTop10Quizzes = createAsyncThunk('statistics/getTop10Quizzes', async (_, { getState }) =>
  apiCallHelper('/api/statistics/top-10-quizzes', 'get', null, getState, 'getTop10Quizzes'));

export const getTop10Notes = createAsyncThunk('statistics/getTop10Notes', async (_, { getState }) =>
  apiCallHelper('/api/statistics/top-10-notes', 'get', null, getState, 'getTop10Notes'));

export const getDailyUserRegistration = createAsyncThunk('statistics/getDailyUserRegistration', async (_, { getState }) =>
  apiCallHelper('/api/statistics/daily-user-registration', 'get', null, getState, 'getDailyUserRegistration'));

// Stats
export const getSummaryStats = createAsyncThunk('statistics/getSummaryStats', async (_, { getState }) =>
  apiCallHelper('/api/statistics/summary-stats', 'get', null, getState, 'getSummaryStats'));

export const getSystemMetrics = createAsyncThunk('statistics/getSystemMetrics', async (_, { getState }) =>
  apiCallHelper('/api/statistics/system-metrics', 'get', null, getState, 'getSystemMetrics'));

export const getDataMetrics = createAsyncThunk('statistics/getDataMetrics', async (_, { getState }) =>
  apiCallHelper('/api/statistics/data-metrics', 'get', null, getState, 'getDataMetrics'));


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
  top10Quizzing: [],
  top10Downloaders: [],
  top10Quizzes: [],
  top10Notes: [],
  dailyUserRegistration: [],
  summaryStats: [],
  systemMetrics: [],
  dataMetrics: [],
  message: null,
  error: null
};

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    clearStatistics: state => {
      state.new50Users = [];
      state.isLoading = false;
      state.allUsers = [];
      state.usersWithImage = [];
      state.usersWithSchool = [];
      state.usersWithLevel = [];
      state.usersWithFaculty = [];
      state.usersWithInterests = [];
      state.usersWithAbout = [];
      state.top10Quizzing = [];
      state.top10Downloaders = [];
      state.top10Quizzes = [];
      state.top10Notes = [];
      state.dailyUserRegistration = [];
      state.summaryStats = [];
      state.systemMetrics = [];
      state.dataMetrics = [];
      state.msg = null;
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(get50NewUsers.fulfilled, (state, action) => {
      state.new50Users = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.allUsers = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUsersWithImage.fulfilled, (state, action) => {
      state.usersWithImage = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUsersWithSchool.fulfilled, (state, action) => {
      state.usersWithSchool = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUsersWithLevel.fulfilled, (state, action) => {
      state.usersWithLevel = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUsersWithFaculty.fulfilled, (state, action) => {
      state.usersWithFaculty = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUsersWithInterests.fulfilled, (state, action) => {
      state.usersWithInterests = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUsersWithAbout.fulfilled, (state, action) => {
      state.usersWithAbout = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTop10QuizzingUsers.fulfilled, (state, action) => {
      state.top10Quizzing = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTop10Downloaders.fulfilled, (state, action) => {
      state.top10Downloaders = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTop10Quizzes.fulfilled, (state, action) => {
      state.top10Quizzes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getTop10Notes.fulfilled, (state, action) => {
      state.top10Notes = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getDailyUserRegistration.fulfilled, (state, action) => {
      state.dailyUserRegistration = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getSummaryStats.fulfilled, (state, action) => {
      state.summaryStats = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getSystemMetrics.fulfilled, (state, action) => {
      state.systemMetrics = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getDataMetrics.fulfilled, (state, action) => {
      state.dataMetrics = action.payload;
      state.isLoading = false;
    });

    // Pending actions
    builder.addCase(get50NewUsers.pending, handlePending);
    builder.addCase(getAllUsers.pending, handlePending);
    builder.addCase(getUsersWithImage.pending, handlePending);
    builder.addCase(getUsersWithSchool.pending, handlePending);
    builder.addCase(getUsersWithLevel.pending, handlePending);
    builder.addCase(getUsersWithFaculty.pending, handlePending);
    builder.addCase(getUsersWithInterests.pending, handlePending);
    builder.addCase(getUsersWithAbout.pending, handlePending);
    builder.addCase(getTop10QuizzingUsers.pending, handlePending);
    builder.addCase(getTop10Downloaders.pending, handlePending);
    builder.addCase(getTop10Quizzes.pending, handlePending);
    builder.addCase(getTop10Notes.pending, handlePending);
    builder.addCase(getDailyUserRegistration.pending, handlePending);
    builder.addCase(getSummaryStats.pending, handlePending);
    builder.addCase(getSystemMetrics.pending, handlePending);
    builder.addCase(getDataMetrics.pending, handlePending);

    // Rejected actions
    builder.addCase(get50NewUsers.rejected, handleRejected);
    builder.addCase(getAllUsers.rejected, handleRejected);
    builder.addCase(getUsersWithImage.rejected, handleRejected);
    builder.addCase(getUsersWithSchool.rejected, handleRejected);
    builder.addCase(getUsersWithLevel.rejected, handleRejected);
    builder.addCase(getUsersWithFaculty.rejected, handleRejected);
    builder.addCase(getUsersWithInterests.rejected, handleRejected);
    builder.addCase(getUsersWithAbout.rejected, handleRejected);
    builder.addCase(getTop10QuizzingUsers.rejected, handleRejected);
    builder.addCase(getTop10Downloaders.rejected, handleRejected);
    builder.addCase(getTop10Quizzes.rejected, handleRejected);
    builder.addCase(getTop10Notes.rejected, handleRejected);
    builder.addCase(getDailyUserRegistration.rejected, handleRejected);
    builder.addCase(getSummaryStats.rejected, handleRejected);
    builder.addCase(getSystemMetrics.rejected, handleRejected);
    builder.addCase(getDataMetrics.rejected, handleRejected);
  }
});

export const { clearStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;