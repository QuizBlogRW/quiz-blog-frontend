import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getLogs = createAsyncThunk("logs/getLogs", async (_, { getState }) =>
  apiCallHelper('/api/logs', 'get', null, getState, 'getLogs'))

export const getOneLog = createAsyncThunk("logs/getOneLog", async (logId, { getState }) =>
  apiCallHelper(`/api/logs/${logId}`, 'get', null, getState, 'getOneLog'))

export const deleteLog = createAsyncThunk("logs/deleteLog", async (id, { getState }) =>
  apiCallHelper(`/api/logs/${id}`, 'delete', null, getState, 'deleteLog'))

// Logs slice
const initialState = {
  isLoading: false,
  log: null,
  logs: [],
  error: null
}

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    clearLogs: state => {
      isLoading = false
      state.log = null
      state.logs = []
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getLogs.fulfilled, (state, action) => {
      state.logs = action.payload
      isLoading = false
    })
    builder.addCase(getOneLog.fulfilled, (state, action) => {
      state.log = action.payload
      isLoading = false
    })
    builder.addCase(deleteLog.fulfilled, (state, action) => {
      state.logs = state.logs.filter(log => log._id !== action.payload)
      isLoading = false
    })

    // Pending actions
    builder.addMatcher(
      (action) => [getLogs.pending, getOneLog.pending, deleteLog.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getLogs.rejected, getOneLog.rejected, deleteLog.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearLogs } = logsSlice.actions
export default logsSlice.reducer