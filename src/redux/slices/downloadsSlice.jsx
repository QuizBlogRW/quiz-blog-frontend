import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getDownloads = createAsyncThunk("downloads/getDownloads", async (pageNo, { getState, dispatch }) =>
  apiCallHelper(`/api/downloads?pageNo=${pageNo}`, 'get', null, getState, dispatch, 'getDownloads'))

export const getCreatorDownloads = createAsyncThunk("downloads/getCreatorDownloads", async (uId, { getState, dispatch }) =>
  apiCallHelper(`/api/downloads/notes-creator/${uId}`, 'get', null, getState, dispatch, 'getCreatorDownloads'))

export const getUserDownloads = createAsyncThunk("downloads/getUserDownloads", async (userId, { getState, dispatch }) =>
  apiCallHelper(`/api/downloads/downloaded-by/${userId}`, 'get', null, getState, dispatch, 'getUserDownloads'))

export const saveDownload = createAsyncThunk("downloads/saveDownload", async (newDownload, { getState, dispatch }) =>
  apiCallHelper('/api/downloads', 'post', newDownload, getState, dispatch, 'saveDownload'))

export const deleteDownload = createAsyncThunk("downloads/deleteDownload", async (downloadID, { getState, dispatch }) =>
  apiCallHelper(`/api/downloads/${downloadID}`, 'delete', null, getState, dispatch, 'deleteDownload'))

// Downloads slice
const initialState = {
  isLoading: false,
  totalPages: 0,
  allDownloads: [],
  creatorDownloads: [],
  userDownloads: []
}

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    clearDownloads: state => {
      state.isLoading = false
      state.totalPages = 0
      state.allDownloads = []
      state.creatorDownloads = []
      state.userDownloads = []
    }
  },
  extraReducers: (builder) => {

    // Pending actions
    builder.addCase(getDownloads.fulfilled, (state, action) => {
      state.allDownloads = action.payload.downloads
      state.totalPages = action.payload.totalPages
      state.isLoading = false
    })
    builder.addCase(getCreatorDownloads.fulfilled, (state, action) => {
      state.creatorDownloads = action.payload
      state.isLoading = false
    })
    builder.addCase(getUserDownloads.fulfilled, (state, action) => {
      state.userDownloads = action.payload
      state.isLoading = false
    })
    builder.addCase(saveDownload.fulfilled, (state, action) => {
      state.allDownloads.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(deleteDownload.fulfilled, (state, action) => {
      state.allDownloads = state.allDownloads.filter(download => download._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getDownloads.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getCreatorDownloads.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getUserDownloads.pending, state => {
      state.isLoading = true
    })
    builder.addCase(saveDownload.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteDownload.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getDownloads.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getCreatorDownloads.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getUserDownloads.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(saveDownload.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteDownload.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearDownloads } = downloadsSlice.actions
export default downloadsSlice.reducer