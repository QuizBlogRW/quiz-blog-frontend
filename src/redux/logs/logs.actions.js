import axios from 'axios'
import { returnErrors } from "../error/error.actions"
import { returnSuccess } from '../success/success.actions'
import { GET_LOGS, GET_LOGS_FAIL, LOGS_LOADING, GET_LOG, GET_LOG_FAIL, LOG_LOADING, DELETE_LOG, DELETE_LOG_FAIL } from "./logs.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// View all logs
export const getLogs = () => async (dispatch, getState) => {
  await dispatch(getLogsLoading())
  try {
    await axiosInstance
      .get('/api/logs', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_LOGS,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err && err && err.response && err.response.data, err && err.response.status, 'GET_LOGS_FAIL'))
    dispatch({ type: GET_LOGS_FAIL })
  }
}

// View one log
export const getOneLog = (logId) => async (dispatch) => {
  await dispatch(getLogLoading())

  try {
    await axiosInstance
      .get(`/api/logs/${logId}`)
      .then(res =>
        dispatch({
          type: GET_LOG,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_LOG_FAIL'))
    dispatch({ type: GET_LOG_FAIL })
  }
}

// Delete a log
export const deleteLog = id => async (dispatch, getState) => {

  try {
    await axiosInstance.delete(`/api/logs/${id}`, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: DELETE_LOG,
          payload: id
        }))
      .then(res =>
        dispatch(
          returnSuccess('Log deleted! Reloading the page ...', 200, 'DELETE_LOG'),
          // Reload after 2 seconds
          window.setTimeout(() => window.location.reload(), 2000)
        ))
  } catch (err) {
    dispatch(returnErrors(err && err && err.response && err.response.data, err && err.response.status, 'DELETE_LOG_FAIL'))
    dispatch({ type: DELETE_LOG_FAIL })
  }
}

export const getLogsLoading = () => {
  return {
    type: LOGS_LOADING
  }
}

export const getLogLoading = () => {
  return {
    type: LOG_LOADING
  }
}