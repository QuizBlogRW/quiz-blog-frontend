import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getSubscribers = createAsyncThunk("subscribers/getSubscribers", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/subscribers', 'get', null, getState, dispatch, 'getSubscribers'))

export const subscribeToNewsLetter = createAsyncThunk("subscribers/subscribeToNewsLetter", async (subscribedUser, { getState, dispatch }) =>
  apiCallHelper('/api/subscribers', 'post', subscribedUser, getState, dispatch, 'subscribeToNewsLetter'))

export const deleteSubscriber = createAsyncThunk("subscribers/deleteSubscriber", async (uemail, { getState, dispatch }) =>
  apiCallHelper(`/api/subscribers/${uemail}`, 'delete', null, getState, dispatch, 'deleteSubscriber'))

// Subscribers slice
const initialState = {
  subscribedUsers: [],
  isLoading: false
}

const subscribersSlice = createSlice({
  name: 'subscribers',
  initialState,
  reducers: {
    clearSubscribers: state => {
      state.subscribedUsers = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fulfilled actions
    builder.addCase(getSubscribers.fulfilled, (state, action) => {
      state.subscribedUsers = action.payload
      state.isLoading = false
    })
    builder.addCase(subscribeToNewsLetter.fulfilled, (state, action) => {
      state.subscribedUsers.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(deleteSubscriber.fulfilled, (state, action) => {
      state.subscribedUsers = state.subscribedUsers.filter(subscriber => subscriber.email !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getSubscribers.pending, state => {
      state.isLoading = true
    })
    builder.addCase(subscribeToNewsLetter.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteSubscriber.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getSubscribers.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(subscribeToNewsLetter.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteSubscriber.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearSubscribers } = subscribersSlice.actions
export default subscribersSlice.reducer