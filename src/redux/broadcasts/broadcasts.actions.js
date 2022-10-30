import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { SET_BROADCASTS, SET_BROADCASTS_FAIL, GET_ONE_BROADCAST, GET_ONE_BROADCAST_FAIL, CREATE_BROADCAST, CREATE_BROADCAST_FAIL, DELETE_BROADCAST, DELETE_BROADCAST_FAIL, BROADCASTS_LOADING } from "./broadcasts.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

// View all broadcasts
export const setBroadcasts = () => async (dispatch, getState) => {
  await dispatch(setBroadcastsLoading())

  try {
    await axiosInstance
      .get('/api/broadcasts', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: SET_BROADCASTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'SET_BROADCASTS_FAIL'))
    dispatch({ type: SET_BROADCASTS_FAIL })
  }
}

// View one broadcast
export const getOneBroadcast = (brcstId) => async (dispatch, getState) => {
  await dispatch(setBroadcastsLoading())

  try {
    await axiosInstance
      .get(`/api/broadcasts/${brcstId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_BROADCAST,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_BROADCAST_FAIL'))
    dispatch({ type: GET_ONE_BROADCAST_FAIL })
  }
}

// Create a broadcast
export const sendBroadcast = (newMessage) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/broadcasts', newMessage, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_BROADCAST,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Broadcast sent! Reloading the page ...', 200, 'CREATE_BROADCAST'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_BROADCAST_FAIL'));
    dispatch({ type: CREATE_BROADCAST_FAIL })
  }
};

// Delete a broadcast
export const deleteBroadcast = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This broadcast will be deleted permanently!")) {
      await axiosInstance
      .delete(`/api/broadcasts/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_BROADCAST,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Deleted! Reloading the page ...', 200, 'DELETE_BROADCAST'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_BROADCAST_FAIL'))
    dispatch({ type: DELETE_BROADCAST_FAIL })
  }
}

export const setBroadcastsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: BROADCASTS_LOADING

  }
}