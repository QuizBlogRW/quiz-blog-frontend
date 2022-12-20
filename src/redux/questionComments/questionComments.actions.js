import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_COMMENTS, GET_COMMENTS_FAIL, GET_ONE_COMMENT, GET_ONE_COMMENT_FAIL, GET_QUESTION_COMMENTS, GET_QUESTION_COMMENTS_FAIL, GET_COMMENTS_BY_QUIZ, GET_COMMENTS_BY_QUIZ_FAIL, COMMENTS_BY_QUIZ_LOADING, CREATE_COMMENT, CREATE_COMMENT_FAIL, DELETE_COMMENT, DELETE_COMMENT_FAIL, UPDATE_COMMENT, UPDATE_COMMENT_FAIL, COMMENTS_LOADING } from "./questionComments.types"
import { tokenConfig } from '../auth/auth.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

// View all comments
export const getComments = () => async (dispatch, getState) => {
  await dispatch(getCommentsLoading())

  try {
    await axiosInstance
      .get('/api/questionComments', tokenConfig(getState))
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

// View question comments
export const getQuestionComments = (questionID) => async (dispatch, getState) => {
  await dispatch(getCommentsLoading())

  try {
    await axiosInstance
      .get(`/api/questionComments/comments-on/${questionID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_QUESTION_COMMENTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_QUESTION_COMMENTS_FAIL'))
    dispatch({ type: GET_QUESTION_COMMENTS_FAIL })
  }
}

// View quiz comments
export const getCommentsByQuiz = (quizID) => async (dispatch, getState) => {
  await dispatch(getCommentsByQuizLoading())

  try {
    await axiosInstance
      .get(`/api/questionComments/quiz/${quizID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_COMMENTS_BY_QUIZ,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_COMMENTS_BY_QUIZ_FAIL'))
    dispatch({ type: GET_COMMENTS_BY_QUIZ_FAIL })
  }
}

// View one comment
export const getOneComment = (commentId) => async (dispatch, getState) => {
  await dispatch(getCommentsLoading())

  try {
    await axiosInstance
      .get(`/api/questionComments/${commentId}`, tokenConfig(getState))
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
      .post('/api/questionComments', newComment, tokenConfig(getState))
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
      .put(`/api/questionComments/${updatedComment.commentID}`, updatedComment, tokenConfig(getState))
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

export const getCommentsByQuizLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: COMMENTS_BY_QUIZ_LOADING

  }
}