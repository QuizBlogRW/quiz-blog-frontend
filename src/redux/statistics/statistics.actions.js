import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_50_NEW_USERS, GET_50_NEW_USERS_FAIL, NEW_50_USERS_LOADING } from "./statistics.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

// View 50 new users
export const get50NewUsers = () => async (dispatch, getState) => {
  await dispatch(get50NewUsersLoading())

  try {
    await axiosInstance
      .get('/api/statistics/users50', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_50_NEW_USERS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Users retrieved successfully!', 200, 'GET_50_NEW_USERS')))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_50_NEW_USERS_FAIL'))
    dispatch({ type: GET_50_NEW_USERS_FAIL })
  }
}

export const get50NewUsersLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: NEW_50_USERS_LOADING

  }
}