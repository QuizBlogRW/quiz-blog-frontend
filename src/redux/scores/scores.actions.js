import axios from 'axios';
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_SCORES, GET_ONE_SCORE, GET_ONE_SCORE_FAIL, GET_TAKER_SCORES, GET_TAKER_SCORES_FAIL, CREATE_SCORE, CREATE_SCORE_FAIL, DELETE_SCORE, DELETE_SCORE_FAIL, UPDATE_SCORE, UPDATE_SCORE_FAIL, SCORES_LOADING, GET_CREATOR_SCORES, GET_CREATOR_SCORES_FAIL, GET_POPULAR_QUIZES, GET_POPULAR_QUIZES_FAIL, GET_MONTHLY_USER, GET_MONTHLY_USER_FAIL, GET_RANKING_SCORES, GET_RANKING_SCORES_FAIL } from "./scores.types";
import { tokenConfig } from '../auth/auth.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

// View all scores
export const setScores = (pageNo) => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores?pageNo=${pageNo}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status));
  }
};

// View all scores for ranking
export const setRankingScores = (quizID) => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores/ranking/${quizID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_RANKING_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_RANKING_SCORES_FAIL'));
    dispatch({ type: GET_RANKING_SCORES_FAIL })
  }
};

// View all scores by a taker
export const getTakerScores = (takerId) => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores/taken-by/${takerId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_TAKER_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_TAKER_SCORES_FAIL'));
    dispatch({ type: GET_TAKER_SCORES_FAIL })
  }
};

// View all scores of quizes created by a creator
export const getCreatorScores = (uId) => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores/quiz-creator/${uId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CREATOR_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response && err.response.data, err.response.status, 'GET_CREATOR_SCORES_FAIL'));
    dispatch({ type: GET_CREATOR_SCORES_FAIL })
  }
};

// View one score
export const getOneScore = (scoreId) => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores/one-score/${scoreId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_SCORE,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_SCORE_FAIL'));
    dispatch({ type: GET_ONE_SCORE_FAIL })
  }
};

// View popular quizes today
export const getPopularToday = () => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores/popular-quizes`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_POPULAR_QUIZES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_POPULAR_QUIZES_FAIL'));
    dispatch({ type: GET_POPULAR_QUIZES_FAIL })
  }
};

// View user of the month
export const getUserOfMonth = () => async (dispatch, getState) => {
  await dispatch(setScoresLoading());

  try {
    await axiosInstance
      .get(`/api/scores/monthly-user`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_MONTHLY_USER,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_MONTHLY_USER_FAIL'));
    dispatch({ type: GET_MONTHLY_USER_FAIL })
  }
};

// Create Score
export const createScore = (newScore) => async (dispatch, getState) => {

  try {
    const res = await axiosInstance
      .post('/api/scores', newScore, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_SCORE,
          payload: res.data
        }))

    // return true if score is created
    if (res) {
      return true
    }

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_SCORE_FAIL'));
    dispatch({ type: CREATE_SCORE_FAIL })

    // return false if score is not created
    return false
  }
};

// Update a Score
export const updateScore = updatedScore => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/scores/${updatedScore.sId}`, updatedScore, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_SCORE,
          payload: updatedScore
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Score updated! Reloading the page ...', 200, 'UPDATE_SCORE'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_SCORE_FAIL'));
    dispatch({ type: UPDATE_SCORE_FAIL })
  }
}

// Delete a Score
export const deleteScore = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This score will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/scores/${id}`, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_SCORE,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Score deleted! Reloading the page ...', 200, 'DELETE_SCORE'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_SCORE_FAIL'));
    dispatch({ type: DELETE_SCORE_FAIL })
  }
}

export const setScoresLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: SCORES_LOADING

  };
}
