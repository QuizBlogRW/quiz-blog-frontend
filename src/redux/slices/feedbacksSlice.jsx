import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getFeedbacks = createAsyncThunk("feedbacks/getFeedbacks", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/feedbacks', 'get', null, getState, dispatch, 'getFeedbacks'))

export const saveFeedback = createAsyncThunk("feedbacks/saveFeedback", async (feedback, { getState, dispatch }) =>
  apiCallHelper('/api/feedbacks', 'post', feedback, getState, dispatch, 'saveFeedback'))

// Feedback slice
const initialState = {
  feedbacks: [],
  isLoading: false
}

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState,
  reducers: {
    clearFeedbacks: state => {
      state.feedbacks = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getFeedbacks.fulfilled, (state, action) => {
      state.feedbacks = action.payload
      state.isLoading = false
    })
    builder.addCase(saveFeedback.fulfilled, (state, action) => {
      state.feedbacks.push(action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getFeedbacks.pending, state => {
      state.isLoading = true
    })
    builder.addCase(saveFeedback.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getFeedbacks.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(saveFeedback.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearFeedbacks } = feedbackSlice.actions
export default feedbackSlice.reducer