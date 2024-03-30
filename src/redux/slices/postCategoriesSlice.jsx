import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getPostCategories = createAsyncThunk("postCategories/getPostCategories", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/postCategories', 'get', null, getState, dispatch, 'getPostCategories'))

export const createPostCategory = createAsyncThunk("postCategories/createPostCategory", async (newPostCategory, { getState, dispatch }) =>
  apiCallHelper('/api/postCategories', 'post', newPostCategory, getState, dispatch, 'createPostCategory'))

export const updatePostCategory = createAsyncThunk("postCategories/updatePostCategory", async (updatedPostCatg, { getState, dispatch }) =>
  apiCallHelper(`/api/postCategories/${updatedPostCatg.idToUpdate}`, 'put', updatedPostCatg, getState, dispatch, 'updatePostCategory'))

export const deletePostCategory = createAsyncThunk("postCategories/deletePostCategory", async (postCatgID, { getState, dispatch }) =>
  apiCallHelper(`/api/postCategories/${postCatgID}`, 'delete', null, getState, dispatch, 'deletePostCategory'))

// Post categories slice
const initialState = {
  allPostCategories: [],
  isLoading: false
}

const postCategoriesSlice = createSlice({
  name: 'postCategories',
  initialState,
  reducers: {
    clearPostCategories: state => {
      state.allPostCategories = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getPostCategories.fulfilled, (state, action) => {
      state.allPostCategories = action.payload
      state.isLoading = false
    })
    builder.addCase(createPostCategory.fulfilled, (state, action) => {
      state.allPostCategories.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updatePostCategory.fulfilled, (state, action) => {
      state.allPostCategories = state.allPostCategories.map(postCategory => postCategory._id === action.payload._id ? action.payload : postCategory)
      state.isLoading = false
    })
    builder.addCase(deletePostCategory.fulfilled, (state, action) => {
      state.allPostCategories = state.allPostCategories.filter(postCategory => postCategory._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getPostCategories.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createPostCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updatePostCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deletePostCategory.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getPostCategories.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(createPostCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updatePostCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deletePostCategory.rejected, (state, action) => {
      state.isLoading = false
    })

  }
})

export const { clearPostCategories } = postCategoriesSlice.actions
export default postCategoriesSlice.reducer