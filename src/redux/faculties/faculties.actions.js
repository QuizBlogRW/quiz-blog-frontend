import axios from 'axios';
import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import { GET_FACULTIES, GET_FACULTIES_FAIL, CREATE_FACULTY, CREATE_FACULTY_FAIL, DELETE_FACULTY, DELETE_FACULTY_FAIL, UPDATE_FACULTY, UPDATE_FACULTY_FAIL, FACULTIES_LOADING, FETCH_LEVEL_FACULTIES, FETCH_LEVEL_FACULTIES_FAIL } from "./faculties.types";
import { tokenConfig } from '../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
})

console.log(`The qbURL is ${qbURL}`);

// View all faculties
export const getFaculties = () => async (dispatch, getState) => {
  await dispatch(getFacultiesLoading());

  try {
    await axiosInstance
      .get('/schoolsapi/faculties', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_FACULTIES,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err && err.response && err.response.data, err && err.response.status, 'GET_FACULTIES_FAIL'));
    dispatch({ type: GET_FACULTIES_FAIL })
  }
};

// View all faculties by a level
export const fetchLevelFaculties = (levelID) => async (dispatch, getState) => {
  await dispatch(getFacultiesLoading());

  try {
    await axiosInstance
      .get(`/schoolsapi/faculties/level/${levelID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: FETCH_LEVEL_FACULTIES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'FETCH_LEVEL_FACULTIES_FAIL'));
    dispatch({ type: FETCH_LEVEL_FACULTIES_FAIL })
  }
};

// Create faculty
export const createFaculty = (newFaculty) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/schoolsapi/faculties', newFaculty, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_FACULTY,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Faculty created! Reloading the page ...', 200, 'CREATE_FACULTY'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_FACULTY_FAIL'));
    dispatch({ type: CREATE_FACULTY_FAIL })
  }
};

// Update a faculty
export const updateFaculty = updatedFac => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/schoolsapi/faculties/${updatedFac.idToUpdate}`, updatedFac, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_FACULTY,
          payload: updatedFac
        }))
      .then(res =>
        dispatch(
          returnSuccess('Faculty updated! Reloading the page ...', 200, 'UPDATE_FACULTY'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_FACULTY_FAIL'));
    dispatch({ type: UPDATE_FACULTY_FAIL });
  }
}

// Delete a faculty
export const deleteFaculty = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This faculty will be deleted permanently!")) {
      await axiosInstance
        .delete(`/schoolsapi/faculties/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_FACULTY,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Faculty deleted! Reloading the page ...', 200, 'DELETE_FACULTY'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_FACULTY_FAIL'));
    dispatch({ type: DELETE_FACULTY_FAIL });
  }
}

export const getFacultiesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: FACULTIES_LOADING

  }
}