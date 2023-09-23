import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_ADVERTS, GET_ADVERTS_FAIL, GET_ONE_ADVERT, GET_ONE_ADVERT_FAIL, CREATE_ADVERT, CREATE_ADVERT_FAIL, DELETE_ADVERT, DELETE_ADVERT_FAIL, UPDATE_ADVERT, UPDATE_ADVERT_FAIL, ADVERTS_LOADING, GET_ACTIVE_ADVERTS, GET_ACTIVE_ADVERTS_FAIL, CHANGE_ADVERT_STATUS, CHANGE_ADVERT_STATUS_FAIL } from "./adverts.types"
import { tokenConfig, uploadConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

if (process.env.NODE_ENV === 'production') {
  // Code to run in production environment
  console.log('This is a production environment.');
} else {
  // Code to run in development environment
  console.log('This is a development environment.');
}

// View all adverts
export const getAdverts = () => async (dispatch, getState) => {
  await dispatch(getAdvertsLoading())

  try {
    await axiosInstance
      .get('/api/adverts', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ADVERTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ADVERTS_FAIL'))
    dispatch({ type: GET_ADVERTS_FAIL })
  }
}

// View all active adverts
export const getActiveAdverts = () => async (dispatch, getState) => {
  await dispatch(getAdvertsLoading())

  try {
    await axiosInstance
      .get('/api/adverts/active', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ACTIVE_ADVERTS,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_ACTIVE_ADVERTS_FAIL'))
    dispatch({ type: GET_ACTIVE_ADVERTS_FAIL })
  }
}


// View one advert
export const getOneAdvert = (AdvertID) => async (dispatch, getState) => {
  await dispatch(getAdvertsLoading())

  try {
    await axiosInstance
      .get(`/api/adverts/${AdvertID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_ADVERT,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_ADVERT_FAIL'))
    dispatch({ type: GET_ONE_ADVERT_FAIL })
  }
}

// Create a advert
export const createAdvert = (newAdvert, onUploadProgress) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/adverts', newAdvert, uploadConfig(getState, onUploadProgress))
      .then(res =>
        dispatch({
          type: CREATE_ADVERT,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Advert created! Reloading the page ...', 200, 'CREATE_ADVERT'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_ADVERT_FAIL'));
    dispatch({ type: CREATE_ADVERT_FAIL })
  }
};

// change status of  an advert
export const changeStatus = (advert) => async (dispatch, getState) => {

  await dispatch(getAdvertsLoading())

  try {
    await axiosInstance
      .put(`/api/adverts/status/${advert.advertID}`, advert, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CHANGE_ADVERT_STATUS,
          payload: advert,
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Ad updated! Reloading the page ...', 200, 'CHANGE_ADVERT_STATUS'),
          // Reload after 3 seconds
          window.setTimeout(() => window.location.reload(), 3000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CHANGE_ADVERT_STATUS_FAIL'))
    dispatch({ type: CHANGE_ADVERT_STATUS_FAIL })
  }
}

// Update a advert
export const updateAdvert = updatedAdvert => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/adverts/${updatedAdvert.AdvertID}`, updatedAdvert, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_ADVERT,
          payload: updatedAdvert
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Advert updated! Reloading the page ...', 200, 'UPDATE_ADVERT'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_ADVERT_FAIL'));
    dispatch({ type: UPDATE_ADVERT_FAIL });
  }
}

// Delete a advert
export const deleteAdvert = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This advert will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/adverts/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_ADVERT,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Deleted! Reloading the page ...', 200, 'DELETE_ADVERT'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_ADVERT_FAIL'))
    dispatch({ type: DELETE_ADVERT_FAIL })
  }
}

export const getAdvertsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: ADVERTS_LOADING

  }
}