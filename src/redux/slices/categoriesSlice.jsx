import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'

// Async actions with createAsyncThunk
export const getCategories = createAsyncThunk("categories/getCategories", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/categories', 'get', null, getState, dispatch, 'getCategories'))

export const getOneCategory = createAsyncThunk("categories/getOneCategory", async (categoryID, { getState, dispatch }) =>
  apiCallHelper(`/api/categories/${categoryID}`, 'get', null, getState, dispatch, 'getOneCategory'))

export const createCategory = createAsyncThunk("categories/createCategory", async (newCategory, { getState, dispatch }) =>
  apiCallHelper('/api/categories', 'post', newCategory, getState, dispatch, 'createCategory'))

export const updateCategory = createAsyncThunk("categories/updateCategory", async (updatedCatg, { getState, dispatch }) =>
  apiCallHelper(`/api/categories/${updatedCatg.catID}`, 'put', updatedCatg, getState, dispatch, 'updateCategory'))

export const deleteCategory = createAsyncThunk("categories/deleteCategory", async (catID, { getState, dispatch }) =>
  apiCallHelper(`/api/categories/${catID}`, 'delete', null, getState, dispatch, 'deleteCategory'))

// Categories slice
const initialState = {
  allcategories: [],
  isLoading: false,
  oneCategory: ''
}

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories: state => {
      state.allcategories = []
      state.isLoading = false
      state.oneCategory = ''
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.allcategories = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneCategory.fulfilled, (state, action) => {
      state.oneCategory = action.payload
      state.isLoading = false
    })
    builder.addCase(createCategory.fulfilled, (state, action) => {
      state.allcategories.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateCategory.fulfilled, (state, action) => {
      state.allcategories = state.allcategories.map(category => category._id === action.payload._id ? action.payload : category)
      state.isLoading = false
    })
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.allcategories = state.allcategories.filter(category => category._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getCategories.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getOneCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateCategory.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteCategory.pending, (state, action) => {
      state.isLoading = true
    })


    // Rejected actions
    builder.addCase(getCategories.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getOneCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(createCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

export const { clearCategories } = categoriesSlice.actions
export default categoriesSlice.reducer