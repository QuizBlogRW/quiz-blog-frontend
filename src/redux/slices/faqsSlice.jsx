import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getFaqs = createAsyncThunk("faqs/getFaqs", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/faqs', 'get', null, getState, dispatch, 'getFaqs'))

export const getOneFaq = createAsyncThunk("faqs/getOneFaq", async (faqId, { getState, dispatch }) =>
  apiCallHelper(`/api/faqs/${faqId}`, 'get', null, getState, dispatch, 'getOneFaq'))

export const createFq = createAsyncThunk("faqs/createFq", async (newFaq, { getState, dispatch }) =>
  apiCallHelper('/api/faqs', 'post', newFaq, getState, dispatch, 'createFq'))

export const updateFaq = createAsyncThunk("faqs/updateFaq", async (updatedFaq, { getState, dispatch }) =>
  apiCallHelper(`/api/faqs/${updatedFaq.faqID}`, 'put', updatedFaq, getState, dispatch, 'updateFaq'))

export const addFaqVidLink = createAsyncThunk("faqs/addFaqVidLink", async ({ newVidLink, faqID }, { getState, dispatch }) =>
  apiCallHelper(`/api/faqs/add-video/${faqID}`, 'put', newVidLink, getState, dispatch, 'addFaqVidLink'))

export const deleteFaqVideo = createAsyncThunk("faqs/deleteFaqVideo", async ({ vidData, vId }, { getState, dispatch }) =>
  apiCallHelper(`/api/faqs/delete-video/${vId}`, 'put', vidData, getState, dispatch, 'deleteFaqVideo'))

export const deleteFaq = createAsyncThunk("faqs/deleteFaq", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/faqs/${id}`, 'delete', null, getState, dispatch, 'deleteFaq'))

// Faqs slice
const initialState = {
  allFaqs: [],
  isLoading: false,
  oneFaq: ''
}

const faqsSlice = createSlice({
  name: 'faqs',
  initialState,
  reducers: {
    clearFaqs: state => {
      state.allFaqs = []
      state.isLoading = false
      state.oneFaq = ''
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getFaqs.fulfilled, (state, action) => {
      state.allFaqs = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneFaq.fulfilled, (state, action) => {
      state.oneFaq = action.payload
      state.isLoading = false
    })
    builder.addCase(createFq.fulfilled, (state, action) => {
      state.allFaqs.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateFaq.fulfilled, (state, action) => {
      state.allFaqs = state.allFaqs.map(faq => faq._id === action.payload._id ? action.payload : faq)
      state.isLoading = false
    })
    builder.addCase(addFaqVidLink.fulfilled, (state, action) => {
      state.allFaqs = state.allFaqs.map(faq => faq._id === action.payload._id ? action.payload : faq)
      state.isLoading = false
    })
    builder.addCase(deleteFaqVideo.fulfilled, (state, action) => {
      state.allFaqs = state.allFaqs.map(faq => faq._id === action.payload._id ? action.payload : faq)
      state.isLoading = false
    })
    builder.addCase(deleteFaq.fulfilled, (state, action) => {
      state.allFaqs = state.allFaqs.filter(faq => faq._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getFaqs.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneFaq.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createFq.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateFaq.pending, state => {
      state.isLoading = true
    })
    builder.addCase(addFaqVidLink.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteFaqVideo.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteFaq.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getFaqs.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneFaq.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createFq.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateFaq.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(addFaqVidLink.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteFaqVideo.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteFaq.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearFaqs } = faqsSlice.actions
export default faqsSlice.reducer