import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getPostCategories = createAsyncThunk("postCategories/getPostCategories", async (_, { getState }) =>
  apiCallHelper('/api/post-categories', 'get', null, getState, 'getPostCategories'))

export const createPostCategory = createAsyncThunk("postCategories/createPostCategory", async (newPostCategory, { getState }) =>
  apiCallHelper('/api/post-categories', 'post', newPostCategory, getState, 'createPostCategory'))

export const updatePostCategory = createAsyncThunk("postCategories/updatePostCategory", async (updatedPostCatg, { getState }) =>
  apiCallHelper(`/api/post-categories/${updatedPostCatg.idToUpdate}`, 'put', updatedPostCatg, getState, 'updatePostCategory'))

export const deletePostCategory = createAsyncThunk("postCategories/deletePostCategory", async (postCatgID, { getState }) =>
  apiCallHelper(`/api/post-categories/${postCatgID}`, 'delete', null, getState, 'deletePostCategory'))

// Post categories slice
const initialState = {
  allPostCategories: [],
  isLoading: false,
  error: null
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
    builder.addMatcher(
      (action) => [getPostCategories.pending, createPostCategory.pending, updatePostCategory.pending, deletePostCategory.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getPostCategories.rejected, createPostCategory.rejected, updatePostCategory.rejected, deletePostCategory.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearPostCategories } = postCategoriesSlice.actions
export default postCategoriesSlice.reducer