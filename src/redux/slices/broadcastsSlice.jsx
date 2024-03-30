import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getBroadcasts = createAsyncThunk("broadcasts/getBroadcasts", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/broadcasts', 'get', null, getState, dispatch, 'getBroadcasts'))

export const getOneBroadcast = createAsyncThunk("broadcasts/getOneBroadcast", async (brcstId, { getState, dispatch }) =>
  apiCallHelper(`/api/broadcasts/${brcstId}`, 'get', null, getState, dispatch, 'getOneBroadcast'))

export const sendBroadcast = createAsyncThunk("broadcasts/sendBroadcast", async (newMessage, { getState, dispatch }) =>
  apiCallHelper('/api/broadcasts', 'post', newMessage, getState, dispatch, 'sendBroadcast'))

export const deleteBroadcast = createAsyncThunk("broadcasts/deleteBroadcast", async (brcstId, { getState, dispatch }) =>
  apiCallHelper(`/api/broadcasts/${brcstId}`, 'delete', null, getState, dispatch, 'deleteBroadcast'))

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
    builder.addCase(getBroadcasts.pending, state => {
      state.isLoading = true
    })

    builder.addCase(getOneBroadcast.pending, state => {
      state.isLoading = true
    })

    builder.addCase(sendBroadcast.pending, state => {
      state.isLoading = true
    })

    builder.addCase(deleteBroadcast.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getBroadcasts.rejected, state => {
      state.isLoading = false
    })

    builder.addCase(getOneBroadcast.rejected, state => {
      state.isLoading = false
    })

    builder.addCase(sendBroadcast.rejected, state => {
      state.isLoading = false
    })

    builder.addCase(deleteBroadcast.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearBroadcasts } = broadcastsSlice.actions
export default broadcastsSlice.reducer