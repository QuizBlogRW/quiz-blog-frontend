import axios from 'axios'
import { returnErrors } from "../../../error/error.actions"
import { returnSuccess } from '../../../success/success.actions'
import { GET_IMAGE_UPLOADS, GET_IMAGE_UPLOADS_FAIL, GET_ONE_IMAGE_UPLOAD, GET_ONE_IMAGE_UPLOAD_FAIL, GET_IMAGE_UPLOADS_BY_OWNER, GET_IMAGE_UPLOADS_BY_OWNER_FAIL, CREATE_IMAGE_UPLOAD, CREATE_IMAGE_UPLOAD_FAIL, DELETE_IMAGE_UPLOAD, DELETE_IMAGE_UPLOAD_FAIL, UPDATE_IMAGE_UPLOAD, UPDATE_IMAGE_UPLOAD_FAIL, IMAGE_UPLOADS_LOADING } from "./uploadImages.types"
import { tokenConfig, uploadConfig } from '../../../auth/auth.actions'
import { apiURL, devApiURL } from '../../../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// View all image uploads
export const getImageUploads = () => async (dispatch, getState) => {
  await dispatch(getImageUploadsLoading())

  try {
    await axiosInstance
      .get(`/api/imageUploads`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_IMAGE_UPLOADS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_IMAGE_UPLOADS_FAIL'))
    dispatch({ type: GET_IMAGE_UPLOADS_FAIL })
  }
}

// View one image upload at a time
export const getOneImageUpload = (imageUploadID) => async (dispatch, getState) => {
  await dispatch(getImageUploadsLoading())

  try {
    await axiosInstance
      .get(`/api/imageUploads/${imageUploadID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_IMAGE_UPLOAD,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_ONE_IMAGE_UPLOAD_FAIL'))
    dispatch({ type: GET_ONE_IMAGE_UPLOAD_FAIL })
  }
}

// View all images by owner
export const getImageUploadsByOwner = (ownerID) => async (dispatch, getState) => {
  await dispatch(getImageUploadsLoading())

  try {
    await axiosInstance
      .get(`/api/imageUploads/imageOwner/${ownerID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_IMAGE_UPLOADS_BY_OWNER,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_IMAGE_UPLOADS_BY_OWNER_FAIL'))
    dispatch({ type: GET_IMAGE_UPLOADS_BY_OWNER_FAIL })
  }
}

// Create image upload
export const createImageUpload = (newImageUpload, onUploadProgress) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/imageUploads', newImageUpload, uploadConfig(getState, onUploadProgress))
      .then(res =>
        dispatch({
          type: CREATE_IMAGE_UPLOAD,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Image upload created! Reloading the page ...', 200, 'CREATE_IMAGE_UPLOAD'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'CREATE_IMAGE_UPLOAD_FAIL'))
    dispatch({ type: CREATE_IMAGE_UPLOAD_FAIL })
  }
}


// Update a image upload
export const updateBlogPost = updatedImgUpload => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/imageUploads/${updatedImgUpload.imageUploadID}`, updatedImgUpload, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_IMAGE_UPLOAD,
          payload: updatedImgUpload
        }))

      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Image upload updated! Reloading the page ...', 200, 'UPDATE_IMAGE_UPLOAD'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'UPDATE_IMAGE_UPLOAD_FAIL'))
    dispatch({ type: UPDATE_IMAGE_UPLOAD_FAIL })
  }
}

// Delete a image upload
export const deleteBlogPost = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This image upload will be deleted permanently!")) {
      await axiosInstance.delete(`/api/imageUploads/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_IMAGE_UPLOAD,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('image upload deleted! Reloading the page ...', 200, 'DELETE_IMAGE_UPLOAD'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'DELETE_IMAGE_UPLOAD_FAIL'))
    dispatch({ type: DELETE_IMAGE_UPLOAD_FAIL })
  }
}

export const getImageUploadsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: IMAGE_UPLOADS_LOADING
  }
}