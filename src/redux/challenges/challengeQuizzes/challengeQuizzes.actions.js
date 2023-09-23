import axios from 'axios';
import { returnErrors } from '../../error/error.actions'
import { returnSuccess } from '../../success/success.actions'
import { GET_CHALLENGE_QUIZES, GET_ONE_CHALLENGE_QUIZ, GET_ONE_CHALLENGE_QUIZ_FAIL, GET_CATEGORY_CHALLENGE_QUIZES, GET_CATEGORY_CHALLENGE_QUIZES_FAIL, CREATE_CHALLENGE_QUIZ, CREATE_CHALLENGE_QUIZ_FAIL, DELETE_CHALLENGE_QUIZ, DELETE_CHALLENGE_QUIZ_FAIL, UPDATE_CHALLENGE_QUIZ, UPDATE_CHALLENGE_QUIZ_FAIL, CHALLENGE_QUIZES_LOADING, GET_ALL_CHALLENGE_QUIZES, ALL_CHALLENGE_QUIZES_LOADING, GET_NOTES_CHALLENGE_QUIZES, GET_NOTES_CHALLENGE_QUIZES_FAIL } from "./challengeQuizzes.types";
import { tokenConfig } from '../../auth/auth.actions'
import { apiURL, devApiURL } from '../../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
});

// View limited quizes
export const getChQuizes = (limit, skip) => async (dispatch) => {
  await dispatch(getChQuizesLoading());

  try {
    await axiosInstance
      .get(`/api/challengeQuizzes?limit=${limit}&skip=${skip}`)
      .then(res =>
        dispatch({
          type: GET_CHALLENGE_QUIZES,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }
};

// View all quizes
export const getAllNoLimitChQuizes = () => async (dispatch) => {
  await dispatch(getAllNoLimitChQuizesLoading());

  try {
    await axiosInstance
      .get(`/api/challengeQuizzes`)
      .then(res =>
        dispatch({
          type: GET_ALL_CHALLENGE_QUIZES,
          payload: res.data,
        }))
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }
};

// View one quiz
export const getOneChQuiz = (chQuizId) => async (dispatch) => {
  await dispatch(getChQuizesLoading());

  try {
    await axiosInstance
      .get(`/api/challengeQuizzes/${chQuizId}`)
      .then(res =>
        dispatch({
          type: GET_ONE_CHALLENGE_QUIZ,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_CHALLENGE_QUIZ_FAIL'));
    dispatch({ type: GET_ONE_CHALLENGE_QUIZ_FAIL })
  }
};

// Get quizes by category
export const getChQuizesByCategory = (categoryID) => async (dispatch, getState) => {
  await dispatch(getChQuizesLoading());

  try {
    await axiosInstance
      .get(`/api/challengeQuizzes/category/${categoryID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CATEGORY_CHALLENGE_QUIZES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_CATEGORY_CHALLENGE_QUIZES_FAIL'));
    dispatch({ type: GET_CATEGORY_CHALLENGE_QUIZES_FAIL })
  }
};


// Get quizes by notes course category
export const getChQuizesByNotes = (courseCategoryID) => async (dispatch, getState) => {
  await dispatch(getChQuizesLoading());

  try {
    await axiosInstance
      .get(`/api/challengeQuizzes/course-notes/${courseCategoryID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTES_CHALLENGE_QUIZES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_NOTES_CHALLENGE_QUIZES_FAIL'));
    dispatch({ type: GET_NOTES_CHALLENGE_QUIZES_FAIL })
  }
};

// Create Quiz
export const createChQuiz = (newChQuiz) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/challengeQuizzes', newChQuiz, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_CHALLENGE_QUIZ,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Challenge created! Reloading the page ...', 200, 'CREATE_CHALLENGE_QUIZ'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_CHALLENGE_QUIZ_FAIL'));
    dispatch({ type: CREATE_CHALLENGE_QUIZ_FAIL })
  }
};

// Update a Quiz
export const updateChQuiz = updatedChQuiz => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/challengeQuizzes/${updatedChQuiz.chQuizID}`, updatedChQuiz, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_CHALLENGE_QUIZ,
          payload: updatedChQuiz
        }))

      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Score updated! Reloading the page ...', 200, 'UPDATE_CHALLENGE_QUIZ'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_CHALLENGE_QUIZ_FAIL'));
    dispatch({ type: UPDATE_CHALLENGE_QUIZ_FAIL })
  }
}

// Delete a Quiz
export const deleteChQuiz = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This challenge will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/challengeQuizzes/${id}`, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_CHALLENGE_QUIZ,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Challenge deleted! Reloading the page ...', 200, 'DELETE_CHALLENGE_QUIZ'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_CHALLENGE_QUIZ_FAIL'));
    dispatch({ type: DELETE_CHALLENGE_QUIZ_FAIL })
  }
}

export const getChQuizesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CHALLENGE_QUIZES_LOADING

  };
}

export const getAllNoLimitChQuizesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: ALL_CHALLENGE_QUIZES_LOADING

  };
}
