import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'
import { notify } from '../../utils/notifyToast'

// Async actions with createAsyncThunk
export const getAdverts = createAsyncThunk("adverts/getAdverts", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/adverts', 'get', null, getState, dispatch, 'getAdverts'))

export const getActiveAdverts = createAsyncThunk("adverts/getActiveAdverts", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/adverts/active', 'get', null, getState, dispatch, 'getActiveAdverts'))

export const getOneAdvert = createAsyncThunk("adverts/getOneAdvert", async (AdvertID, { getState, dispatch }) =>
  apiCallHelper(`/api/adverts/${AdvertID}`, 'get', null, getState, dispatch, 'getOneAdvert'))

export const createAdvert = createAsyncThunk("adverts/createAdvert", async (formData, { getState, dispatch }) =>
  apiCallHelperUpload('/api/adverts', 'post', formData, getState, dispatch, 'createAdvert'))

export const changeStatus = createAsyncThunk("adverts/changeStatus", async (advert, { getState, dispatch }) =>
  apiCallHelper(`/api/adverts/status/${advert.advertID}`, 'put', advert, getState, dispatch, 'changeStatus'))

export const updateAdvert = createAsyncThunk("adverts/updateAdvert", async (updatedAdvert, { getState, dispatch }) =>
  apiCallHelper(`/api/adverts/${updatedAdvert.AdvertID}`, 'put', updatedAdvert, getState, dispatch, 'updateAdvert'))

export const deleteAdvert = createAsyncThunk("adverts/deleteAdvert", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/adverts/${id}`, 'delete', null, getState, dispatch, 'deleteAdvert'))

// Adverts slice
const initialState = {
  allAdverts: [],
  activeAdverts: [],
  isLoading: false,
  oneAdvert: ''
}

const advertsSlice = createSlice({
  name: 'adverts',
  initialState,
  reducers: {
    clearAdverts: state => {
      state.allAdverts = []
      state.activeAdverts = []
      state.isLoading = false
      state.oneAdvert = ''
    }
  },
  extraReducers: (builder) => {
    // Fullfilled actions
    builder.addCase(getAdverts.fulfilled, (state, action) => {
      state.allAdverts = action.payload
      state.isLoading = false
    })
    builder.addCase(getActiveAdverts.fulfilled, (state, action) => {
      state.activeAdverts = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneAdvert.fulfilled, (state, action) => {
      state.oneAdvert = action.payload
      state.isLoading = false
    })
    builder.addCase(createAdvert.fulfilled, (state, action) => {
      state.allAdverts.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(changeStatus.fulfilled, (state, action) => {
      state.activeAdverts = state.activeAdverts.map(advert => advert._id === action.payload._id ? action.payload : advert)
      state.isLoading = false
      notify('Advert status changed successfully!')
    })
    builder.addCase(updateAdvert.fulfilled, (state, action) => {
      state.allAdverts = state.allAdverts.map(advert => advert._id === action.payload._id ? action.payload : advert)
      state.isLoading = false
    })
    builder.addCase(deleteAdvert.fulfilled, (state, action) => {
      state.allAdverts = state.allAdverts.filter(advert => advert._id !== action.payload)
      state.activeAdverts = state.activeAdverts.filter(advert => advert._id !== action.payload)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getAdverts.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getActiveAdverts.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getOneAdvert.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(createAdvert.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(changeStatus.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateAdvert.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteAdvert.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getAdverts.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getActiveAdverts.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getOneAdvert.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(createAdvert.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(changeStatus.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateAdvert.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteAdvert.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

export const { clearAdverts } = advertsSlice.actions
export default advertsSlice.reducer
