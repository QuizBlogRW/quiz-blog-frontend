import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'
import { notify } from '../../utils/notifyToast'

// Async actions with createAsyncThunk
export const getSubscribers = createAsyncThunk("subscribers/getSubscribers", async (_, { getState }) =>
  apiCallHelper('/api/subscribers', 'get', null, getState, 'getSubscribers'))

export const subscribeToPosts = createAsyncThunk("subscribers/subscribeToPosts", async (subscribedUser, { getState }) =>
  apiCallHelper('/api/subscribers', 'post', subscribedUser, getState, 'subscribeToPosts'))

export const deleteSubscriber = createAsyncThunk("subscribers/deleteSubscriber", async (uemail, { getState }) =>
  apiCallHelper(`/api/subscribers/${uemail}`, 'delete', null, getState, 'deleteSubscriber'))

// Subscribers slice
const initialState = {
  subscribedUsers: [],
  isLoading: false,
  error: null
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
    builder.addCase(subscribeToPosts.fulfilled, (state, action) => {
      state.subscribedUsers.push(action.payload)
      state.isLoading = false
      notify('Thank for subscribing to our posts!')
    })
    builder.addCase(deleteSubscriber.fulfilled, (state, action) => {
      state.subscribedUsers = state.subscribedUsers.filter(subscriber => subscriber.email !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addMatcher(
      (action) => [getSubscribers.pending, subscribeToPosts.pending, deleteSubscriber.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getSubscribers.rejected, subscribeToPosts.rejected, deleteSubscriber.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearSubscribers } = subscribersSlice.actions
export default subscribersSlice.reducer