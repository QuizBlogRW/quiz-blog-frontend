import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'
import { notify } from '../../utils/notifyToast'

// Async actions with createAsyncThunk
export const getAdverts = createAsyncThunk("adverts/getAdverts", async (_, { getState }) =>
  apiCallHelper('/api/adverts', 'get', null, getState, 'getAdverts'))

export const getActiveAdverts = createAsyncThunk("adverts/getActiveAdverts", async (_, { getState }) =>
  apiCallHelper('/api/adverts/active', 'get', null, getState, 'getActiveAdverts'))

export const getOneAdvert = createAsyncThunk("adverts/getOneAdvert", async (AdvertID, { getState }) =>
  apiCallHelper(`/api/adverts/${AdvertID}`, 'get', null, getState, 'getOneAdvert'))

export const createAdvert = createAsyncThunk("adverts/createAdvert", async (formData, { getState }) =>
  apiCallHelperUpload('/api/adverts', 'post', formData, getState, 'createAdvert'))

export const changeStatus = createAsyncThunk("adverts/changeStatus", async (advert, { getState }) =>
  apiCallHelper(`/api/adverts/status/${advert.advertID}`, 'put', advert, getState, 'changeStatus'))

export const updateAdvert = createAsyncThunk("adverts/updateAdvert", async (updatedAdvert, { getState }) =>
  apiCallHelper(`/api/adverts/${updatedAdvert.AdvertID}`, 'put', updatedAdvert, getState, 'updateAdvert'))

export const deleteAdvert = createAsyncThunk("adverts/deleteAdvert", async (id, { getState }) =>
  apiCallHelper(`/api/adverts/${id}`, 'delete', null, getState, 'deleteAdvert'))

// Adverts slice
const initialState = {
  allAdverts: [],
  activeAdverts: [],
  isLoading: false,
  oneAdvert: '',
  error: null
}

const advertsSlice = createSlice({
  name: 'adverts',
  initialState,
  reducers: {
    clearAdverts: state => {
      state.allAdverts = []
      state.activeAdverts = []
      state.isLoading = false
      state.oneAdvert = '',
      state.error = null
    }
  },
  extraReducers: (builder) => {
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
    builder.addMatcher(
      (action) => [getAdverts.pending, getActiveAdverts.pending, getOneAdvert.pending, createAdvert.pending, changeStatus.pending, updateAdvert.pending, deleteAdvert.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [getAdverts.rejected, getActiveAdverts.rejected, getOneAdvert.rejected, createAdvert.rejected, changeStatus.rejected, updateAdvert.rejected, deleteAdvert.rejected].includes(action.type),
      (state) => {
        state.isLoading = false
        state.error = action.payload
      })
  }
})

export const { clearAdverts } = advertsSlice.actions
export default advertsSlice.reducer
