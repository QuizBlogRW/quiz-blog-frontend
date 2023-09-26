import axios from 'axios';
import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import { GET_LEVELS, GET_LEVELS_FAIL, CREATE_LEVEL, CREATE_LEVEL_FAIL, DELETE_LEVEL, DELETE_LEVEL_FAIL, UPDATE_LEVEL, UPDATE_LEVEL_FAIL, LEVELS_LOADING, FETCH_SCHOOL_LEVELS, FETCH_SCHOOL_LEVELS_FAIL } from "./levels.types";
import { tokenConfig } from '../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
})

console.log(`The qbURL is ${qbURL}`);

// View all levels
export const getLevels = () => async (dispatch, getState) => {
  await dispatch(getLevelsLoading());

  try {
    await axiosInstance
      .get('/schoolsapi/levels', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_LEVELS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err && err.response && err.response.data, err && err.response.status, 'GET_LEVELS_FAIL'));
    dispatch({ type: GET_LEVELS_FAIL })
  }
};

// View all levels by a school
export const fetchSchoolLevels = (schoolID) => async (dispatch, getState) => {
  await dispatch(getLevelsLoading());

  try {
    await axiosInstance
      .get(`/schoolsapi/levels/school/${schoolID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: FETCH_SCHOOL_LEVELS,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'FETCH_SCHOOL_LEVELS_FAIL'));
    dispatch({ type: FETCH_SCHOOL_LEVELS_FAIL })
  }
};

// Create Level
export const createLevel = (newLevel) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/schoolsapi/levels', newLevel, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_LEVEL,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Level created! Reloading the page ...', 200, 'CREATE_LEVEL'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_LEVEL_FAIL'));
    dispatch({ type: CREATE_LEVEL_FAIL })
  }
};


// Update a Level
export const updateLevel = updatedLev => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/schoolsapi/levels/${updatedLev.idToUpdate}`, updatedLev, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_LEVEL,
          payload: updatedLev
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Level updated! Reloading the page ...', 200, 'UPDATE_LEVEL'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_LEVEL_FAIL'));
    dispatch({ type: UPDATE_LEVEL_FAIL });
  }
}

// Delete a Level
export const deleteLevel = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This Level will be deleted permanently!")) {
      await axiosInstance.delete(`/schoolsapi/levels/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_LEVEL,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Level deleted! Reloading the page ...', 200, 'DELETE_LEVEL'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_LEVEL_FAIL'));
    dispatch({ type: DELETE_LEVEL_FAIL });
  }
}

export const getLevelsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: LEVELS_LOADING

  }
}