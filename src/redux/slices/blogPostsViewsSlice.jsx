import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getBlogPostsViews = createAsyncThunk("blogPostsViews/getBlogPostsViews", async ({ limit, skip }, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPostsViews?limit=${limit}&skip=${skip ? skip : 0}`, 'get', null, getState, dispatch, 'getBlogPostsViews'))

export const getRecentTenViews = createAsyncThunk("blogPostsViews/getRecentTenViews", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/blogPostsViews/recentTen', 'get', null, getState, dispatch, 'getRecentTenViews'))

export const getOneBlogPostView = createAsyncThunk("blogPostsViews/getOneBlogPostView", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPostsViews/${id}`, 'get', null, getState, dispatch, 'getOneBlogPostView'))

export const createBlogPostView = createAsyncThunk("blogPostsViews/createBlogPostView", async (newBlogPostView, { getState, dispatch }) =>
  apiCallHelper('/api/blogPostsViews', 'post', newBlogPostView, getState, dispatch, 'createBlogPostView'))

export const updateBlogPostView = createAsyncThunk("blogPostsViews/updateBlogPostView", async (updatedBPV, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPostsViews/${updatedBPV.blogPostViewID}`, 'put', updatedBPV, getState, dispatch, 'updateBlogPostView'))

export const deleteBlogPostView = createAsyncThunk("blogPostsViews/deleteBlogPostView", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/blogPostsViews/${id}`, 'delete', null, getState, dispatch, 'deleteBlogPostView'))

// Blog posts views slice
const initialState = {
  allBlogPostsViews: [],
  recentTenViews: [],
  oneBlogPostView: '',
  blogPostsByCategory: [],
  isLoading: false
}

const blogPostsViewsSlice = createSlice({
  name: 'blogPostsViews',
  initialState,
  reducers: {
    clearBlogPostsViews: state => {
      state.allBlogPostsViews = []
      state.recentTenViews = []
      state.oneBlogPostView = ''
      state.blogPostsByCategory = []
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getBlogPostsViews.fulfilled, (state, action) => {
      state.allBlogPostsViews = action.payload
      state.isLoading = false
    })
    builder.addCase(getRecentTenViews.fulfilled, (state, action) => {
      state.recentTenViews = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneBlogPostView.fulfilled, (state, action) => {
      state.oneBlogPostView = action.payload
      state.isLoading = false
    })
    builder.addCase(createBlogPostView.fulfilled, (state, action) => {
      state.allBlogPostsViews.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateBlogPostView.fulfilled, (state, action) => {
      state.allBlogPostsViews = state.allBlogPostsViews.map(blogPostView => blogPostView._id === action.payload._id ? action.payload : blogPostView)
      state.isLoading = false
    })
    builder.addCase(deleteBlogPostView.fulfilled, (state, action) => {
      state.allBlogPostsViews = state.allBlogPostsViews.filter(blogPostView => blogPostView._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getBlogPostsViews.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getRecentTenViews.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneBlogPostView.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createBlogPostView.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateBlogPostView.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteBlogPostView.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getBlogPostsViews.rejected, state => {
      state.isLoading = false
      state.allBlogPostsViews = []
    })
    builder.addCase(getRecentTenViews.rejected, state => {
      state.isLoading = false
      state.recentTenViews = []
    })
    builder.addCase(getOneBlogPostView.rejected, state => {
      state.isLoading = false
      state.oneBlogPostView = ''
    })
    builder.addCase(createBlogPostView.rejected, state => {
      state.isLoading = false
    })

    builder.addCase(updateBlogPostView.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteBlogPostView.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearBlogPostsViews } = blogPostsViewsSlice.actions
export default blogPostsViewsSlice.reducer