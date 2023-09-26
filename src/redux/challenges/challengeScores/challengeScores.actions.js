import axios from 'axios';
import { returnErrors } from "../../error/error.actions";
import { returnSuccess } from '../../success/success.actions'
import { GET_CHALLENGE_SCORES, GET_ONE_CHALLENGE_SCORE, GET_ONE_CHALLENGE_SCORE_FAIL, GET_TAKER_CHALLENGE_SCORES, GET_TAKER_CHALLENGE_SCORES_FAIL, CREATE_CHALLENGE_SCORE, CREATE_CHALLENGE_SCORE_FAIL, DELETE_CHALLENGE_SCORE, DELETE_CHALLENGE_SCORE_FAIL, UPDATE_CHALLENGE_SCORE, UPDATE_CHALLENGE_SCORE_FAIL, CHALLENGE_SCORES_LOADING, GET_CREATOR_CHALLENGE_SCORES, GET_CREATOR_CHALLENGE_SCORES_FAIL, GET_RANKING_CHALLENGE_SCORES, GET_RANKING_CHALLENGE_SCORES_FAIL } from "./challengeScores.types";
import { tokenConfig } from '../../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
})

console.log(`The qbURL is ${qbURL}`);

// View all scores
export const getScores = (pageNo) => async (dispatch, getState) => {
  await dispatch(getChScoresLoading());

  try {
    await axiosInstance
      .get(`/api/challengeScores?pageNo=${pageNo}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CHALLENGE_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status));
  }
};

// View all scores for ranking
export const getRankingScores = (chQuizID) => async (dispatch, getState) => {
  await dispatch(getChScoresLoading());

  try {
    await axiosInstance
      .get(`/api/challengeScores/ranking/${chQuizID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_RANKING_CHALLENGE_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_RANKING_CHALLENGE_SCORES_FAIL'));
    dispatch({ type: GET_RANKING_CHALLENGE_SCORES_FAIL })
  }
};

// View all scores by a taker
export const getTakerScores = (takerId) => async (dispatch, getState) => {
  await dispatch(getChScoresLoading());

  try {
    await axiosInstance
      .get(`/api/challengeScores/taken-by/${takerId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_TAKER_CHALLENGE_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_TAKER_CHALLENGE_SCORES_FAIL'));
    dispatch({ type: GET_TAKER_CHALLENGE_SCORES_FAIL })
  }
};

// View all scores of quizes created by a creator
export const getCreatorScores = (uId) => async (dispatch, getState) => {
  await dispatch(getChScoresLoading());

  try {
    await axiosInstance
      .get(`/api/challengeScores/quiz-creator/${uId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CREATOR_CHALLENGE_SCORES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_CREATOR_CHALLENGE_SCORES_FAIL'));
    dispatch({ type: GET_CREATOR_CHALLENGE_SCORES_FAIL })
  }
};

// View one score
export const getOneScore = (scoreId) => async (dispatch, getState) => {
  await dispatch(getChScoresLoading());

  try {
    await axiosInstance
      .get(`/api/challengeScores/one-score/${scoreId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_CHALLENGE_SCORE,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_CHALLENGE_SCORE_FAIL'));
    dispatch({ type: GET_ONE_CHALLENGE_SCORE_FAIL })
  }
};

// Create Score
export const createChScore = (newChScore) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/challengeScores', newChScore, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_CHALLENGE_SCORE,
          payload: res.data
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_CHALLENGE_SCORE_FAIL'));
    dispatch({ type: CREATE_CHALLENGE_SCORE_FAIL })
  }
};

// Update a Score
export const updateChScore = updatedChScore => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/challengeScores/${updatedChScore.chId}`, updatedChScore, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_CHALLENGE_SCORE,
          payload: updatedChScore
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Score updated! Reloading the page ...', 200, 'UPDATE_CHALLENGE_SCORE'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_CHALLENGE_SCORE_FAIL'));
    dispatch({ type: UPDATE_CHALLENGE_SCORE_FAIL })
  }
}

// Delete a Score
export const deleteChScore = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This score will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/challengeScores/${id}`, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_CHALLENGE_SCORE,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Score deleted! Reloading the page ...', 200, 'DELETE_CHALLENGE_SCORE'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_CHALLENGE_SCORE_FAIL'));
    dispatch({ type: DELETE_CHALLENGE_SCORE_FAIL })
  }
}

export const getChScoresLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CHALLENGE_SCORES_LOADING

  };
}
