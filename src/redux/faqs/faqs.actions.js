import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_FAQS, GET_FAQS_FAIL, GET_ONE_FAQ, GET_ONE_FAQ_FAIL, CREATE_FAQ, CREATE_FAQ_FAIL, DELETE_FAQ, DELETE_FAQ_FAIL, UPDATE_FAQ, UPDATE_FAQ_FAIL, FAQS_LOADING } from "./faqs.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

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
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_FAQS_FAIL'))
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
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_FAQ_FAIL'))
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
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_FAQ_FAIL'));
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
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_FAQ_FAIL'));
    dispatch({ type: UPDATE_FAQ_FAIL });
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
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_FAQ_FAIL'))
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