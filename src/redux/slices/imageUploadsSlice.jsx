import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getImageUploads = createAsyncThunk("imageUploads/getImageUploads", async (_, { getState }) =>
  apiCallHelper('/api/imageUploads', 'get', null, getState, 'getImageUploads'))

export const getOneImageUpload = createAsyncThunk("imageUploads/getOneImageUpload", async (imageUploadID, { getState }) =>
  apiCallHelper(`/api/imageUploads/${imageUploadID}`, 'get', null, getState, 'getOneImageUpload'))

export const getImageUploadsByOwner = createAsyncThunk("imageUploads/getImageUploadsByOwner", async (ownerID, { getState }) =>
  apiCallHelper(`/api/imageUploads/imageOwner/${ownerID}`, 'get', null, getState, 'getImageUploadsByOwner'))

export const createImageUpload = createAsyncThunk("imageUploads/createImageUpload", async (newImageUpload, { getState }) =>
  apiCallHelperUpload('/api/imageUploads', 'post', newImageUpload, getState, 'createImageUpload'))

export const updateImageUpload = createAsyncThunk("imageUploads/updateImageUpload", async (updatedImgUpload, { getState }) =>
  apiCallHelper(`/api/imageUploads/${updatedImgUpload.imageUploadID}`, 'put', updatedImgUpload, getState, 'updateImageUpload'))

export const deleteImageUpload = createAsyncThunk("imageUploads/deleteImageUpload", async (id, { getState }) =>
  apiCallHelper(`/api/imageUploads/${id}`, 'delete', null, getState, 'deleteImageUpload'))

// Image uploads slice
const initialState = {
  allImageUploads: [],
  oneImageUpload: '',
  imageUploadsByOwner: [],
  isLoading: false,
  error: null
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
    builder.addMatcher(
      (action) => [getImageUploads.pending, getOneImageUpload.pending, getImageUploadsByOwner.pending, createImageUpload.pending, updateImageUpload.pending, deleteImageUpload.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getImageUploads.rejected, getOneImageUpload.rejected, getImageUploadsByOwner.rejected, createImageUpload.rejected, updateImageUpload.rejected, deleteImageUpload.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearImageUploads } = imageUploadsSlice.actions
export default imageUploadsSlice.reducer