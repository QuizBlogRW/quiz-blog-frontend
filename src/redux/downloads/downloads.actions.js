import axios from 'axios'
import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import { SAVE_DOWNLOAD, SAVE_DOWNLOAD_FAIL, GET_DOWNLOADS, GET_DOWNLOADS_FAIL, DELETE_DOWNLOAD, DELETE_DOWNLOAD_FAIL, DOWNLOADS_LOADING, GET_CREATOR_DOWNLOADS, GET_CREATOR_DOWNLOADS_FAIL, GET_USER_DOWNLOADS, GET_USER_DOWNLOADS_FAIL } from "./downloads.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// View all downloads
export const getDownloads = (pageNo) => async (dispatch, getState) => {
  await dispatch(getDownloadsLoading())

  try {
    await axiosInstance
      .get(`/api/downloads?pageNo=${pageNo}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_DOWNLOADS,
          payload: res.data
        }))

  } catch (err) {
    dispatch(returnErrors(err && err && err.response && err.response.data, err && err.response.status, 'GET_DOWNLOADS_FAIL'))
    dispatch({ type: GET_DOWNLOADS_FAIL })
  }
}

// View all downloads of notes created by a creator
export const getCreatorDownloads = (uId) => async (dispatch, getState) => {
  await dispatch(getDownloadsLoading())

  try {
    await axiosInstance
      .get(`/api/downloads/notes-creator/${uId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CREATOR_DOWNLOADS,
          payload: res.data
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_CREATOR_DOWNLOADS_FAIL'))
    dispatch({ type: GET_CREATOR_DOWNLOADS_FAIL })
  }
}

// View all downloads by a user
export const getUserDownloads = (userId) => async (dispatch, getState) => {
  await dispatch(getDownloadsLoading())

  try {
    await axiosInstance
      .get(`/api/downloads/downloaded-by/${userId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USER_DOWNLOADS,
          payload: res.data
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USER_DOWNLOADS_FAIL'))
    dispatch({ type: GET_USER_DOWNLOADS_FAIL })
  }
}


// Save download downloads
export const saveDownload = (newDownload) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/downloads', newDownload, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: SAVE_DOWNLOAD,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Saved download!', 200, 'SAVE_DOWNLOAD')))

  } catch (err) {
    dispatch(returnErrors(err && err && err.response && err.response.data, err && err.response.status, 'SAVE_DOWNLOAD_FAIL'));
    dispatch({ type: SAVE_DOWNLOAD_FAIL })
  }
};


// Delete a download
export const deleteDownload = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This download will be deleted permanently!")) {
      await axiosInstance.delete(`/api/downloads/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_DOWNLOAD,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Course deleted! Reloading the page ...', 200, 'DELETE_DOWNLOAD'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_DOWNLOAD_FAIL'))
    dispatch({ type: DELETE_DOWNLOAD_FAIL })
  }
}

export const getDownloadsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: DOWNLOADS_LOADING

  }
}
