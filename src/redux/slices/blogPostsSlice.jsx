import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getBlogPosts = createAsyncThunk("blogPosts/getBlogPosts", async ({ limit, skip }, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPosts?limit=${limit}&skip=${skip ? skip : 0}`, 'get', null, getState, dispatch, 'getBlogPosts'))

export const getOneBlogPost = createAsyncThunk("blogPosts/getOneBlogPost", async (bPSlug, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPosts/${bPSlug}`, 'get', null, getState, dispatch, 'getOneBlogPost'))

export const getBlogPostsByCategory = createAsyncThunk("blogPosts/getBlogPostsByCategory", async (bPCatID, { getState, dispatch }) =>
  apiCallHelper(`/api/blogposts/postCategory/${bPCatID}`, 'get', null, getState, dispatch, 'getBlogPostsByCategory'))

export const createBlogPost = createAsyncThunk("blogPosts/createBlogPost", async ({ newBlogPost, onUploadProgress }, { getState, dispatch }) =>
  apiCallHelperUpload('/api/blogPosts', 'post', newBlogPost, getState, dispatch, 'createBlogPost', onUploadProgress))

export const updateBlogPost = createAsyncThunk("blogPosts/updateBlogPost", async (updatedBP, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPosts/${updatedBP.blogPostID}`, 'put', updatedBP, getState, dispatch, 'updateBlogPost'))

export const deleteBlogPost = createAsyncThunk("blogPosts/deleteBlogPost", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPosts/${id}`, 'delete', null, getState, dispatch, 'deleteBlogPost'))

// Blog posts slice
const initialState = {
  isLoading: false,
  blogPosts: [],
  oneBlogPost: '',
  blogPostsByCategory: [],
}

const blogPostsSlice = createSlice({
  name: 'blogPosts',
  initialState,
  reducers: {
    clearBlogPosts: state => {
      state.isLoading = false
      state.blogPosts = []
      state.oneBlogPost = ''
      state.blogPostsByCategory = []
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getBlogPosts.fulfilled, (state, action) => {
      state.blogPosts = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneBlogPost.fulfilled, (state, action) => {
      state.oneBlogPost = action.payload
      state.isLoading = false
    })
    builder.addCase(getBlogPostsByCategory.fulfilled, (state, action) => {
      state.blogPostsByCategory = action.payload
      state.isLoading = false
    })
    builder.addCase(createBlogPost.fulfilled, (state, action) => {
      state.blogPosts.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateBlogPost.fulfilled, (state, action) => {
      state.blogPosts = state.blogPosts.map(blogPost => blogPost._id === action.payload._id ? action.payload : blogPost)
      state.isLoading = false
    })
    builder.addCase(deleteBlogPost.fulfilled, (state, action) => {
      state.blogPosts = state.blogPosts.filter(blogPost => blogPost._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getBlogPosts.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneBlogPost.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getBlogPostsByCategory.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createBlogPost.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateBlogPost.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteBlogPost.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getBlogPosts.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneBlogPost.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getBlogPostsByCategory.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createBlogPost.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateBlogPost.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteBlogPost.rejected, state => {
      state.isLoading = false
    })

  }
})

export const { clearBlogPosts } = blogPostsSlice.actions
export default blogPostsSlice.reducer