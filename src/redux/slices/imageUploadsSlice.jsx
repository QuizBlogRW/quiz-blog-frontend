import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getImageUploads = createAsyncThunk("imageUploads/getImageUploads", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/imageUploads', 'get', null, getState, dispatch, 'getImageUploads'))

export const getOneImageUpload = createAsyncThunk("imageUploads/getOneImageUpload", async (imageUploadID, { getState, dispatch }) =>
  apiCallHelper(`/api/imageUploads/${imageUploadID}`, 'get', null, getState, dispatch, 'getOneImageUpload'))

export const getImageUploadsByOwner = createAsyncThunk("imageUploads/getImageUploadsByOwner", async (ownerID, { getState, dispatch }) =>
  apiCallHelper(`/api/imageUploads/imageOwner/${ownerID}`, 'get', null, getState, dispatch, 'getImageUploadsByOwner'))

export const createImageUpload = createAsyncThunk("imageUploads/createImageUpload", async (newImageUpload, { getState, dispatch }) =>
  apiCallHelperUpload('/api/imageUploads', 'post', newImageUpload, getState, dispatch, 'createImageUpload'))

export const updateImageUpload = createAsyncThunk("imageUploads/updateImageUpload", async (updatedImgUpload, { getState, dispatch }) =>
  apiCallHelper(`/api/imageUploads/${updatedImgUpload.imageUploadID}`, 'put', updatedImgUpload, getState, dispatch, 'updateImageUpload'))

export const deleteImageUpload = createAsyncThunk("imageUploads/deleteImageUpload", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/imageUploads/${id}`, 'delete', null, getState, dispatch, 'deleteImageUpload'))

// Image uploads slice
const initialState = {
  allImageUploads: [],
  oneImageUpload: '',
  imageUploadsByOwner: [],
  isLoading: false
}

const imageUploadsSlice = createSlice({
  name: 'imageUploads',
  initialState,
  reducers: {
    clearImageUploads: state => {
      state.allImageUploads = []
      state.oneImageUpload = ''
      state.imageUploadsByOwner = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getImageUploads.fulfilled, (state, action) => {
      state.allImageUploads = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneImageUpload.fulfilled, (state, action) => {
      state.oneImageUpload = action.payload
      state.isLoading = false
    })
    builder.addCase(getImageUploadsByOwner.fulfilled, (state, action) => {
      state.imageUploadsByOwner = action.payload
      state.isLoading = false
    })
    builder.addCase(createImageUpload.fulfilled, (state, action) => {
      state.allImageUploads.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateImageUpload.fulfilled, (state, action) => {
      state.allImageUploads = state.allImageUploads.map(imageUpload => imageUpload._id === action.payload._id ? action.payload : imageUpload)
      state.isLoading = false
    })
    builder.addCase(deleteImageUpload.fulfilled, (state, action) => {
      state.allImageUploads = state.allImageUploads.filter(imageUpload => imageUpload._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getImageUploads.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneImageUpload.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getImageUploadsByOwner.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createImageUpload.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateImageUpload.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteImageUpload.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getImageUploads.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneImageUpload.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getImageUploadsByOwner.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createImageUpload.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateImageUpload.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteImageUpload.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearImageUploads } = imageUploadsSlice.actions
export default imageUploadsSlice.reducer