import axios from 'axios';
import { returnErrors } from '../error/error.actions'
import { GET_CHALLENGES, GET_ONE_CHALLENGE, GET_ONE_CHALLENGE_FAIL, GET_CHALLENGER_CHALLENGES, GET_CHALLENGER_CHALLENGES_FAIL, CREATE_CHALLENGE, CREATE_CHALLENGE_FAIL, DELETE_CHALLENGE, DELETE_CHALLENGE_FAIL, UPDATE_CHALLENGE, UPDATE_CHALLENGE_FAIL, CHALLENGES_LOADING } from "./challenges.types";
import { tokenConfig } from '../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? (qbURL || devApiURL) : apiURL,
})

console.log(`The qbURL is ${qbURL}`);

// View all challenges
export const setChallenges = (pageNo) => async (dispatch, getState) => {
  await dispatch(setChallengesLoading());

  try {
    await axiosInstance
      .get(`/api/challenges?pageNo=${pageNo}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CHALLENGES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status));
  }
};

// View all challenges by a challenger
export const getChallengerChallenges = (challengerId) => async (dispatch, getState) => {
  await dispatch(setChallengesLoading());

  try {
    await axiosInstance
      .get(`/api/challenges/challenged-by/${challengerId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CHALLENGER_CHALLENGES,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_CHALLENGER_CHALLENGES_FAIL'));
    dispatch({ type: GET_CHALLENGER_CHALLENGES_FAIL })
  }
};

// View one challenge
export const getOneChallenge = (challengeId) => async (dispatch, getState) => {
  await dispatch(setChallengesLoading());

  try {
    await axiosInstance
      .get(`/api/challenges/${challengeId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_CHALLENGE,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_CHALLENGE_FAIL'));
    dispatch({ type: GET_ONE_CHALLENGE_FAIL })
  }
};

// Create challenge
export const createChallenge = (newChallenge) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/challenges', newChallenge, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: CREATE_CHALLENGE,
          payload: res.data
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'CREATE_CHALLENGE_FAIL'));
    dispatch({ type: CREATE_CHALLENGE_FAIL })
  }
};


// Update a Challenge
export const updateChallenge = updatedChallenge => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/challenges/${updatedChallenge.sId}`, updatedChallenge, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: UPDATE_CHALLENGE,
          payload: updatedChallenge
        }),
        alert('UPDATED!'))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_CHALLENGE_FAIL'));
    dispatch({ type: UPDATE_CHALLENGE_FAIL })
  }
}

// Delete a Challenge
export const deleteChallenge = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This challenge will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/challenges/${id}`, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_CHALLENGE,
            payload: id
          }),
          alert('DELETED!.'))
    }

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_CHALLENGE_FAIL'));
    dispatch({ type: DELETE_CHALLENGE_FAIL })
  }
}

export const setChallengesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CHALLENGES_LOADING

  };
}