import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCallHelper, handlePending, handleRejected } from '../configHelpers';

// Async actions with createAsyncThunk
export const getDownloads = createAsyncThunk('downloads/getDownloads', async (pageNo, { getState }) =>
  apiCallHelper(`/api/downloads?pageNo=${pageNo}`, 'get', null, getState, 'getDownloads'));

export const getDownloadsByCreator = createAsyncThunk('downloads/getDownloadsByCreator', async (uId, { getState }) =>
  apiCallHelper(`/api/downloads/creator/${uId}`, 'get', null, getState, 'getDownloadsByCreator'));

export const getDownloadsByUser = createAsyncThunk('downloads/getDownloadsByUser', async (userId, { getState }) =>
  apiCallHelper(`/api/downloads/downloaded-by/${userId}`, 'get', null, getState, 'getDownloadsByUser'));

export const saveDownload = createAsyncThunk('downloads/saveDownload', async (newDownload, { getState }) =>
  apiCallHelper('/api/downloads', 'post', newDownload, getState, 'saveDownload'));

export const deleteDownload = createAsyncThunk('downloads/deleteDownload', async (downloadID, { getState }) =>
  apiCallHelper(`/api/downloads/${downloadID}`, 'delete', null, getState, 'deleteDownload'));

// Downloads slice
const initialState = {
  isLoading: false,
  totalPages: 0,
  allDownloads: [],
  creatorDownloads: [],
  userDownloads: [],
  error: null
};

const downloadsSlice = createSlice({
  name: 'downloads',
  initialState,
  reducers: {
    clearDownloads: state => {
      state.isLoading = false;
      state.totalPages = 0;
      state.allDownloads = [];
      state.creatorDownloads = [];
      state.userDownloads = [];
    }
  },
  extraReducers: (builder) => {

    // Pending actions
    builder.addCase(getDownloads.fulfilled, (state, action) => {
      state.allDownloads = action.payload.downloads;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    });
    builder.addCase(getDownloadsByCreator.fulfilled, (state, action) => {
      state.creatorDownloads = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getDownloadsByUser.fulfilled, (state, action) => {
      state.userDownloads = action.payload;
      state.isLoading = false;
    });
    builder.addCase(saveDownload.fulfilled, (state, action) => {
      state.allDownloads.unshift(action.payload);
      state.isLoading = false;
    });
    builder.addCase(deleteDownload.fulfilled, (state, action) => {
      state.allDownloads = state.allDownloads.filter(download => download._id !== action.payload._id);
      state.isLoading = false;
    });

    // Pending actions
    builder.addCase(getDownloads.pending, handlePending);
    builder.addCase(getDownloadsByCreator.pending, handlePending);
    builder.addCase(getDownloadsByUser.pending, handlePending);
    builder.addCase(saveDownload.pending, handlePending);
    builder.addCase(deleteDownload.pending, handlePending);

    // Rejected actions
    builder.addCase(getDownloads.rejected, handleRejected);
    builder.addCase(getDownloadsByCreator.rejected, handleRejected);
    builder.addCase(getDownloadsByUser.rejected, handleRejected);
    builder.addCase(saveDownload.rejected, handleRejected);
    builder.addCase(deleteDownload.rejected, handleRejected);
  }
});

export const { clearDownloads } = downloadsSlice.actions;
export default downloadsSlice.reducer;