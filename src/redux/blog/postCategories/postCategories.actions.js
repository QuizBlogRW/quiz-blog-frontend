import axios from 'axios'
import { returnErrors } from "../../error/error.actions"
import { returnSuccess } from '../../success/success.actions'
import { GET_POST_CATEGORIES, GET_POST_CATEGORIES_FAIL, CREATE_POST_CATEGORY, CREATE_POST_CATEGORY_FAIL, DELETE_POST_CATEGORY, DELETE_POST_CATEGORY_FAIL, UPDATE_POST_CATEGORY, UPDATE_POST_CATEGORY_FAIL, POST_CATEGORIES_LOADING } from "./postCategories.types"
import { tokenConfig } from '../../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
})

console.log(`The qbURL is ${qbURL}`);


// View all post categories
export const getPostCategories = () => async (dispatch, getState) => {
  await dispatch(getPostCategoriesLoading())

  try {
    await axiosInstance
      .get('/api/postCategories', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_POST_CATEGORIES,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_POST_CATEGORIES_FAIL'))
    dispatch({ type: GET_POST_CATEGORIES_FAIL })
  }
}

// Create post category
export const createPostCategory = (newPostCategory) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/postCategories', newPostCategory, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_POST_CATEGORY,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Post category created! Reloading the page ...', 200, 'CREATE_POST_CATEGORY'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_POST_CATEGORY_FAIL'))
    dispatch({ type: CREATE_POST_CATEGORY_FAIL })
  }
}


// Update a Post category
export const updatePostCategory = updatedPostCatg => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/postCategories/${updatedPostCatg.idToUpdate}`, updatedPostCatg, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_POST_CATEGORY,
          payload: updatedPostCatg
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Post category updated! Reloading the page ...', 200, 'UPDATE_POST_CATEGORY'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_POST_CATEGORY_FAIL'))
    dispatch({ type: UPDATE_POST_CATEGORY_FAIL })
  }
}

// Delete a Post category
export const deletePostCategory = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This Post category will be deleted permanently!")) {
      await axiosInstance.delete(`/api/postCategories/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_POST_CATEGORY,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Post category deleted! Reloading the page ...', 200, 'DELETE_POST_CATEGORY'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_POST_CATEGORY_FAIL'))
    dispatch({ type: DELETE_POST_CATEGORY_FAIL })
  }
}

export const getPostCategoriesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: POST_CATEGORIES_LOADING

  }
}