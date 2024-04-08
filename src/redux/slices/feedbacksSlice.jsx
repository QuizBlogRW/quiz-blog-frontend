import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'
import { notify } from '../../utils/notifyToast'

// Async actions with createAsyncThunk
export const getFeedbacks = createAsyncThunk("feedbacks/getFeedbacks", async (pageNo, { getState, dispatch }) =>
  apiCallHelper(`/api/feedbacks?pageNo=${pageNo}`, 'get', null, getState, dispatch, 'getFeedbacks'))

export const saveFeedback = createAsyncThunk("feedbacks/saveFeedback", async (feedback, { getState, dispatch }) =>
  apiCallHelper('/api/feedbacks', 'post', feedback, getState, dispatch, 'saveFeedback'))

// Feedback slice
const initialState = {
  allFeedbacks: [],
  totalPages: 0,
  oneFeedback: '',
  isLoading: false
}

const feedbackSlice = createSlice({
  name: 'feedbacks',
  initialState,
  reducers: {
    clearFeedbacks: state => {
      state.allFeedbacks = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getFeedbacks.fulfilled, (state, action) => {
      state.allFeedbacks = action.payload.feedbacks
      state.totalPages = action.payload.totalPages
      state.isLoading = false
    })
    builder.addCase(saveFeedback.fulfilled, (state, action) => {
      state.allFeedbacks.push(action.payload)
      state.isLoading = false
      notify('Your feedback has been received!')
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
      state.allFeedbacks = []
    })
    builder.addCase(saveFeedback.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearFeedbacks } = feedbackSlice.actions
export default feedbackSlice.reducer