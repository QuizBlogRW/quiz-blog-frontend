import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getBroadcasts = createAsyncThunk("broadcasts/getBroadcasts", async (_, { getState }) =>
  apiCallHelper('/api/broadcasts', 'get', null, getState, 'getBroadcasts'))

export const getOneBroadcast = createAsyncThunk("broadcasts/getOneBroadcast", async (brcstId, { getState }) =>
  apiCallHelper(`/api/broadcasts/${brcstId}`, 'get', null, getState, 'getOneBroadcast'))

export const sendBroadcast = createAsyncThunk("broadcasts/sendBroadcast", async (newMessage, { getState }) =>
  apiCallHelper('/api/broadcasts', 'post', newMessage, getState, 'sendBroadcast'))

export const deleteBroadcast = createAsyncThunk("broadcasts/deleteBroadcast", async (brcstId, { getState }) =>
  apiCallHelper(`/api/broadcasts/${brcstId}`, 'delete', null, getState, 'deleteBroadcast'))

// Broadcasts slice
const initialState = {
  allBroadcasts: [],
  isLoading: false,
  oneBroadcast: ''
}

const broadcastsSlice = createSlice({
  name: 'broadcasts',
  initialState,
  reducers: {
    clearBroadcasts: state => {
      state.allBroadcasts = []
      state.isLoading = false
      state.oneBroadcast = ''
    }
  },
  extraReducers: (builder) => {

    // Fulfilled actions
    builder.addCase(getBroadcasts.fulfilled, (state, action) => {
      state.allBroadcasts = action.payload
      state.isLoading = false
    })

    builder.addCase(getOneBroadcast.fulfilled, (state, action) => {
      state.oneBroadcast = action.payload
      state.isLoading = false
    })

    builder.addCase(sendBroadcast.fulfilled, (state, action) => {
      state.allBroadcasts.push(action.payload)
      state.isLoading = false
    })

    builder.addCase(deleteBroadcast.fulfilled, (state, action) => {
      state.allBroadcasts = state.allBroadcasts.filter(broadcast => broadcast._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addMatcher(
      (action) => [getBroadcasts.pending, getOneBroadcast.pending, sendBroadcast.pending, deleteBroadcast.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getBroadcasts.rejected, getOneBroadcast.rejected, sendBroadcast.rejected, deleteBroadcast.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearBroadcasts } = broadcastsSlice.actions
export default broadcastsSlice.reducer