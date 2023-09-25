import axios from 'axios'

import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import { SET_QUIZES, GET_ONE_QUIZ, GET_ONE_QUIZ_LOADING, GET_ONE_QUIZ_FAIL, GET_CATEGORY_QUIZES, GET_CATEGORY_QUIZES_FAIL, CREATE_QUIZ, CREATE_QUIZ_FAIL, DELETE_QUIZ, DELETE_QUIZ_FAIL, UPDATE_QUIZ, UPDATE_QUIZ_FAIL, QUIZES_LOADING, NOTIFY_USERS, NOTIFY_USERS_FAIL, SET_ALL_QUIZES, ALL_QUIZES_LOADING, ADD_VIDEO_LINK, ADD_VIDEO_LINK_FAIL, DELETE_VIDEO, DELETE_VIDEO_FAIL, GET_NOTES_QUIZES, GET_NOTES_QUIZES_FAIL, GET_PAGINATED_QUIZES, PAGINATED_QUIZES_LOADING } from "./quizes.types"

import { tokenConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})


export const setPaginatedQuizes = (pageNo) => async (dispatch, getState) => {
  await dispatch(setPaginatedQuizesLoading())

  try {
    await axiosInstance
      .get(`/api/quizes/paginated/?pageNo=${pageNo}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_PAGINATED_QUIZES,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status))
  }
}

// View limited quizes
export const setQuizes = (limit, skip) => async (dispatch) => {
  await dispatch(setQuizesLoading())

  try {
    await axiosInstance
      .get(`/api/quizes?limit=${limit}&skip=${skip}`)
      .then(res =>
        dispatch({
          type: SET_QUIZES,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status))

  }
}


// View all quizes
export const setAllNoLimitQuizes = () => async (dispatch) => {
  await dispatch(setAllNoLimitQuizesLoading())

  try {
    await axiosInstance
      .get(`/api/quizes`)
      .then(res =>
        dispatch({
          type: SET_ALL_QUIZES,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status))

  }
}


// View one quiz
export const getOneQuiz = (quizSlug) => async (dispatch) => {
  await dispatch(setOneQuizLoading())

  try {
    await axiosInstance
      .get(`/api/quizes/${quizSlug}`)
      .then(res =>
        dispatch({
          type: GET_ONE_QUIZ,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_ONE_QUIZ_FAIL'))

    dispatch({ type: GET_ONE_QUIZ_FAIL })
  }
}


// Get quizes by category
export const getQuizesByCategory = (categoryID) => async (dispatch, getState) => {
  await dispatch(setQuizesLoading())

  try {
    await axiosInstance
      .get(`/api/quizes/category/${categoryID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CATEGORY_QUIZES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_CATEGORY_QUIZES_FAIL'))

    dispatch({ type: GET_CATEGORY_QUIZES_FAIL })
  }
}


// Get quizes by notes course category
export const getQuizesByNotes = (courseCategoryID) => async (dispatch, getState) => {
  await dispatch(setQuizesLoading())

  try {
    await axiosInstance
      .get(`/api/quizes/course-notes/${courseCategoryID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTES_QUIZES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_NOTES_QUIZES_FAIL'))

    dispatch({ type: GET_NOTES_QUIZES_FAIL })
  }
}


// Create Quiz
export const createQuiz = (newQuiz) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/quizes', newQuiz, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_QUIZ,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Quiz created! Reloading the page ...', 200, 'CREATE_QUIZ'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'CREATE_QUIZ_FAIL'))

    dispatch({ type: CREATE_QUIZ_FAIL })
  }
}

// Send Mail after quiz full
export const notifying = (newQuizInfo) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/quizes/notifying', newQuizInfo, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: NOTIFY_USERS,
          payload: res.data
        }),
        alert('Notify the subscribers via email ...'))

      // Redirected to dashboard
      .then(res =>
        dispatch(
          returnSuccess('Subcribers notified! Reloading the page ...', 200, 'NOTIFY_USERS'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.href = "/webmaster", 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'NOTIFY_USERS_FAIL'))

    dispatch({ type: NOTIFY_USERS_FAIL })
  }
}


// Update a Quiz
export const updateQuiz = updatedQuiz => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/quizes/${updatedQuiz.quizID}`, updatedQuiz, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_QUIZ,
          payload: updatedQuiz
        }))

      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Score updated! Reloading the page ...', 200, 'UPDATE_QUIZ'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'UPDATE_QUIZ_FAIL'))

    dispatch({ type: UPDATE_QUIZ_FAIL })
  }
}

// Update a Quiz
export const addVidLink = (newVidLink, quizID) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/quizes/add-video/${quizID}`, newVidLink, tokenConfig(getState))
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
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'ADD_VIDEO_LINK_FAIL'))

    dispatch({ type: ADD_VIDEO_LINK_FAIL })
  }
}

// Delete a video
export const deleteVideo = (vidData, vId) => async (dispatch, getState) => {

  try {
    if (window.confirm("This video will be deleted permanently!")) {
      await axiosInstance
        .put(`/api/quizes/delete-video/${vId}`, vidData, tokenConfig(getState))
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
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'DELETE_VIDEO_FAIL'))

    dispatch({ type: DELETE_VIDEO_FAIL })
  }
}

// Delete a Quiz
export const deleteQuiz = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This quiz will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/quizes/${id}`, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_QUIZ,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Quiz deleted! Reloading the page ...', 200, 'DELETE_QUIZ'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'DELETE_QUIZ_FAIL'))

    dispatch({ type: DELETE_QUIZ_FAIL })
  }
}

export const setQuizesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: QUIZES_LOADING

  }
}

export const setPaginatedQuizesLoading = () => {
  //Return an action to the reducer
  return {
    //action
    type: PAGINATED_QUIZES_LOADING
  }
}

export const setOneQuizLoading = () => {
  //Return an action to the reducer
  return {
    //action
    type: GET_ONE_QUIZ_LOADING
  }
}

export const setAllNoLimitQuizesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: ALL_QUIZES_LOADING
  }
}
