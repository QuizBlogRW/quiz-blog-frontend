import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_FAQS, GET_FAQS_FAIL, GET_ONE_FAQ, GET_ONE_FAQ_FAIL, CREATE_FAQ, CREATE_FAQ_FAIL, DELETE_FAQ, DELETE_FAQ_FAIL, UPDATE_FAQ, UPDATE_FAQ_FAIL, FAQS_LOADING, DELETE_VIDEO, DELETE_VIDEO_FAIL, ADD_VIDEO_LINK, ADD_VIDEO_LINK_FAIL } from "./faqs.types"
import { tokenConfig } from '../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
})

console.log(`The qbURL is ${qbURL}`);

// View all faqs
export const getFaqs = () => async (dispatch, getState) => {
  await dispatch(getFaqsLoading())

  try {
    await axiosInstance
      .get('/api/faqs', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_FAQS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_FAQS_FAIL'))
    dispatch({ type: GET_FAQS_FAIL })
  }
}

// View one faq
export const getOneFaq = (faqId) => async (dispatch, getState) => {
  await dispatch(getFaqsLoading())

  try {
    await axiosInstance
      .get(`/api/faqs/${faqId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_FAQ,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_FAQ_FAIL'))
    dispatch({ type: GET_ONE_FAQ_FAIL })
  }
}

// Create a faq
export const createFq = (newFaq) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/faqs', newFaq, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_FAQ,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Faq created! Reloading the page ...', 200, 'CREATE_FAQ'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_FAQ_FAIL'));
    dispatch({ type: CREATE_FAQ_FAIL })
  }
};

// Update a Faq
export const updateFaq = updatedFaq => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/faqs/${updatedFaq.faqID}`, updatedFaq, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_FAQ,
          payload: updatedFaq
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Faq updated! Reloading the page ...', 200, 'UPDATE_FAQ'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_FAQ_FAIL'));
    dispatch({ type: UPDATE_FAQ_FAIL });
  }
}

// Add a video
export const addFaqVidLink = (newVidLink, faqID) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/faqs/add-video/${faqID}`, newVidLink, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: ADD_VIDEO_LINK,
          payload: newVidLink
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Video added! Reloading the page ...', 200, 'ADD_VIDEO_LINK'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'ADD_VIDEO_LINK_FAIL'))

    dispatch({ type: ADD_VIDEO_LINK_FAIL })
  }
}

// Delete a video
export const deleteFaqVideo = (vidData, vId) => async (dispatch, getState) => {

  try {
    if (window.confirm("This video will be deleted permanently!")) {
      await axiosInstance
        .put(`/api/faqs/delete-video/${vId}`, vidData, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_VIDEO,
            payload: vidData
          }))
        .then(res =>
          dispatch(
            returnSuccess('Video deleted! Reloading the page ...', 200, 'DELETE_VIDEO'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_VIDEO_FAIL'))

    dispatch({ type: DELETE_VIDEO_FAIL })
  }
}

// Delete a faq
export const deleteFaq = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This faq will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/faqs/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_FAQ,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Deleted! Reloading the page ...', 200, 'DELETE_FAQ'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_FAQ_FAIL'))
    dispatch({ type: DELETE_FAQ_FAIL })
  }
}

export const getFaqsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: FAQS_LOADING

  }
}