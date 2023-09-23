import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_COMMENTS, GET_COMMENTS_FAIL, GET_ONE_COMMENT, GET_ONE_COMMENT_FAIL, GET_QUIZ_COMMENTS, GET_QUIZ_COMMENTS_FAIL, CREATE_COMMENT, CREATE_COMMENT_FAIL, DELETE_COMMENT, DELETE_COMMENT_FAIL, UPDATE_COMMENT, UPDATE_COMMENT_FAIL, COMMENTS_LOADING } from "./quizComments.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// View all comments
export const getAllComments = () => async (dispatch, getState) => {
  await dispatch(getCommentsLoading())

  try {
    await axiosInstance
      .get('/api/quizComments', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_COMMENTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_COMMENTS_FAIL'))
    dispatch({ type: GET_COMMENTS_FAIL })
  }
}

// View quiz comments
export const getQuizComments = (quizID) => async (dispatch, getState) => {
  await dispatch(getCommentsLoading())

  try {
    await axiosInstance
      .get(`/api/quizComments/comments-on/${quizID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_QUIZ_COMMENTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_QUIZ_COMMENTS_FAIL'))
    dispatch({ type: GET_QUIZ_COMMENTS_FAIL })
  }
}

// View one comment
export const getOneComment = (commentId) => async (dispatch, getState) => {
  await dispatch(getCommentsLoading())

  try {
    await axiosInstance
      .get(`/api/quizComments/${commentId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_COMMENT,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_COMMENT_FAIL'))
    dispatch({ type: GET_ONE_COMMENT_FAIL })
  }
}

// Create a comment
export const createComment = (newComment) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/quizComments', newComment, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_COMMENT,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Comment Added!', 200, 'CREATE_COMMENT'),
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_COMMENT_FAIL'));
    dispatch({ type: CREATE_COMMENT_FAIL })
  }
};

// Update a Comment
export const updateComment = updatedComment => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/quizComments/${updatedComment.commentID}`, updatedComment, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_COMMENT,
          payload: updatedComment
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Comment updated! Reloading the page ...', 200, 'UPDATE_COMMENT'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_COMMENT_FAIL'));
    dispatch({ type: UPDATE_COMMENT_FAIL });
  }
}

// Delete a comment
export const deleteComment = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This comment will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/comments/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_COMMENT,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Deleted! Reloading the page ...', 200, 'DELETE_COMMENT'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_COMMENT_FAIL'))
    dispatch({ type: DELETE_COMMENT_FAIL })
  }
}

export const getCommentsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: COMMENTS_LOADING

  }
}