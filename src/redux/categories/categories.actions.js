import axios from 'axios'
import { returnErrors } from "../error/error.actions"
import { returnSuccess } from '../success/success.actions'
import { SET_CATEGORIES, GET_ONE_CATEGORY, GET_ONE_CATEGORY_FAIL, SET_CATEGORIES_FAIL, CREATE_CATEGORY, CREATE_CATEGORY_FAIL, DELETE_CATEGORY, DELETE_CATEGORY_FAIL, UPDATE_CATEGORY, UPDATE_CATEGORY_FAIL, CATEGORY_LOADING, CATEGORIES_LOADING } from "./categories.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// View all categories
export const setCategories = () => async (dispatch, getState) => {
  await dispatch(setCategoriesLoading())

  try {
    await axiosInstance
      .get('/api/categories', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: SET_CATEGORIES,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'SET_CATEGORIES_FAIL'))
    dispatch({ type: SET_CATEGORIES_FAIL })
  }
}

// View one category
export const getOneCategory = (categoryId) => async (dispatch) => {
  await dispatch(setCategoryLoading())

  try {
    await axiosInstance
      .get(`/api/categories/${categoryId}`)
      .then(res =>
        dispatch({
          type: GET_ONE_CATEGORY,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_CATEGORY_FAIL'))
    dispatch({ type: GET_ONE_CATEGORY_FAIL })
  }
}

// Create category
export const createCategory = (newCategory) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/categories', newCategory, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_CATEGORY,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Category created! Reloading the page ...', 200, 'CREATE_CATEGORY'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_CATEGORY_FAIL'))
    dispatch({ type: CREATE_CATEGORY_FAIL })
  }
}


// Update a category
export const updateCategory = updatedCatg => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/categories/${updatedCatg.catID}`, updatedCatg, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_CATEGORY,
          payload: updatedCatg
        }))
      .then(res =>
        dispatch(
          returnSuccess('Category updated! Reloading the page ...', 200, 'DELETE_SCORE'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_CATEGORY_FAIL'))
    dispatch({ type: UPDATE_CATEGORY_FAIL })
  }
}

// Delete a category
export const deleteCategory = id => async (dispatch, getState) => {

  try {
    await axiosInstance.delete(`/api/categories/${id}`, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: DELETE_CATEGORY,
          payload: id
        }))
      .then(res =>
        dispatch(
          returnSuccess('Category deleted! Reloading the page ...', 200, 'DELETE_CATEGORY'),
          // Reload after 2 seconds
          window.setTimeout(() => window.location.reload(), 2000)
        ))
  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'DELETE_CATEGORY_FAIL'))
    dispatch({ type: DELETE_CATEGORY_FAIL })
  }
}

export const setCategoriesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CATEGORIES_LOADING

  }
}

export const setCategoryLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CATEGORY_LOADING

  }
}