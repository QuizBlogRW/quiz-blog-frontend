import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getLogs = createAsyncThunk("logs/getLogs", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/logs', 'get', null, getState, dispatch, 'getLogs'))

export const getOneLog = createAsyncThunk("logs/getOneLog", async (logId, { getState, dispatch }) =>
  apiCallHelper(`/api/logs/${logId}`, 'get', null, getState, dispatch, 'getOneLog'))

export const deleteLog = createAsyncThunk("logs/deleteLog", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/logs/${id}`, 'delete', null, getState, dispatch, 'deleteLog'))

// Logs slice
const initialState = {
  isLogsLoading: false,
  isLogLoading: false,
  log: null,
  logs: []
}

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    clearLogs: state => {
      state.isLogsLoading = false
      state.isLogLoading = false
      state.log = null
      state.logs = []
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getLogs.fulfilled, (state, action) => {
      state.logs = action.payload
      state.isLogsLoading = false
    })
    builder.addCase(getOneLog.fulfilled, (state, action) => {
      state.log = action.payload
      state.isLogLoading = false
    })
    builder.addCase(deleteLog.fulfilled, (state, action) => {
      state.logs = state.logs.filter(log => log._id !== action.payload)
      state.isLogsLoading = false
    })

    // Pending actions
    builder.addCase(getLogs.pending, state => {
      state.isLogsLoading = true
    })
    builder.addCase(getOneLog.pending, state => {
      state.isLogLoading = true
    })
    builder.addCase(deleteLog.pending, state => {
      state.isLogsLoading = true
    })

    // Rejected actions
    builder.addCase(getLogs.rejected, state => {
      state.isLogsLoading = false
    })
    builder.addCase(getOneLog.rejected, state => {
      state.isLogLoading = false
    })
    builder.addCase(deleteLog.rejected, state => {
      state.isLogsLoading = false
    })
  }
})

export const { clearLogs } = logsSlice.actions
export default logsSlice.reducer