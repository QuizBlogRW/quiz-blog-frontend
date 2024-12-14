import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getBlogPosts = createAsyncThunk("blogPosts/getBlogPosts", async ({ limit, skip }, { getState }) =>
  apiCallHelper(`/api/blog-posts?limit=${limit}&skip=${skip ? skip : 0}`, 'get', null, getState, 'getBlogPosts'))

export const getOneBlogPost = createAsyncThunk("blogPosts/getOneBlogPost", async (bPSlug, { getState }) =>
  apiCallHelper(`/api/blog-posts/${bPSlug}`, 'get', null, getState, 'getOneBlogPost'))

export const getBlogPostsByCategory = createAsyncThunk("blogPosts/getBlogPostsByCategory", async (bPCatID, { getState }) =>
  apiCallHelper(`/api/blog-posts/postCategory/${bPCatID}`, 'get', null, getState, 'getBlogPostsByCategory'))

export const createBlogPost = createAsyncThunk("blogPosts/createBlogPost", async (newBlogPost, { getState }) =>
  apiCallHelperUpload('/api/blog-posts', 'post', newBlogPost, getState, 'createBlogPost'))

export const updateBlogPost = createAsyncThunk("blogPosts/updateBlogPost", async (updatedBP, { getState }) =>
  apiCallHelper(`/api/blog-posts/${updatedBP.blogPostID}`, 'put', updatedBP, getState, 'updateBlogPost'))

export const deleteBlogPost = createAsyncThunk("blogPosts/deleteBlogPost", async (id, { getState }) =>
  apiCallHelper(`/api/blog-posts/${id}`, 'delete', null, getState, 'deleteBlogPost'))

export const deleteBlogPostImage = createAsyncThunk("blogPosts/deleteBlogPostImage", async (id, { getState }) =>
  apiCallHelper(`/api/imageUploads/${id}`, 'delete', null, getState, 'deleteBlogPostImage'))

// Blog posts slice
const initialState = {
  isLoading: false,
  blogPosts: [],
  oneBlogPost: '',
  blogPostsByCategory: [],
  error: null
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
    builder.addMatcher(
      (action) => [getBlogPosts.pending, getOneBlogPost.pending, getBlogPostsByCategory.pending, createBlogPost.pending, updateBlogPost.pending, deleteBlogPost.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getBlogPosts.rejected, getOneBlogPost.rejected, getBlogPostsByCategory.rejected, createBlogPost.rejected, updateBlogPost.rejected, deleteBlogPost.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
      })
  }
})

export const { clearBlogPosts } = blogPostsSlice.actions
export default blogPostsSlice.reducer