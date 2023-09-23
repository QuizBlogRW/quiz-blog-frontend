import axios from 'axios';
import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import { GET_SCHOOLS, GET_SCHOOLS_FAIL, CREATE_SCHOOL, CREATE_SCHOOL_FAIL, DELETE_SCHOOL, DELETE_SCHOOL_FAIL, UPDATE_SCHOOL, UPDATE_SCHOOL_FAIL, SCHOOLS_LOADING, GET_ONE_SCHOOL, GET_ONE_SCHOOL_FAIL } from "./schools.types";
import { tokenConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
});

// View all schools
export const getSchools = () => async (dispatch, getState) => {
  await dispatch(getSchoolsLoading());

  try {
    await axiosInstance
      .get('/schoolsapi/schools', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_SCHOOLS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_SCHOOLS_FAIL'));
    dispatch({ type: GET_SCHOOLS_FAIL })
  }
};

// View one school
export const getOneSchool = (schoolId) => async (dispatch) => {
  await dispatch(getSchoolsLoading());

  try {
    await axiosInstance
      .get(`/schoolsapi/schools/${schoolId}`)
      .then(res =>
        dispatch({
          type: GET_ONE_SCHOOL,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_SCHOOL_FAIL'));
    dispatch({ type: GET_ONE_SCHOOL_FAIL })
  }
};

// Create school
export const createSchool = (newSchool) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/schoolsapi/schools', newSchool, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_SCHOOL,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('School created! Reloading the page ...', 200, 'CREATE_SCHOOL'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'CREATE_SCHOOL_FAIL'));
    dispatch({ type: CREATE_SCHOOL_FAIL })
  }
};


// Update a school
export const updateSchool = updatedsch => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/schoolsapi/schools/${updatedsch.idToUpdate}`, updatedsch, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_SCHOOL,
          payload: updatedsch
        }))
      .then(res =>
        dispatch(
          returnSuccess('School updated! Reloading the page ...', 200, 'UPDATE_SCHOOL'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_SCHOOL_FAIL'));
    dispatch({ type: UPDATE_SCHOOL_FAIL });
  }
}

// Delete a school
export const deleteSchool = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This school will be deleted permanently!")) {
      await axiosInstance
        .delete(`/schoolsapi/schools/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_SCHOOL,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('School deleted! Reloading the page ...', 200, 'DELETE_SCHOOL'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_SCHOOL_FAIL'));
    dispatch({ type: DELETE_SCHOOL_FAIL });
  }
}

export const getSchoolsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: SCHOOLS_LOADING

  }
}