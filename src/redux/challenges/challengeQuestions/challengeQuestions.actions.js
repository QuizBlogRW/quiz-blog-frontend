import { GET_CHALLENGE_QUESTIONS, GET_ONE_CHALLENGE_QUESTION, GET_ONE_CHALLENGE_QUESTION_FAIL, CHALLENGE_QUESTIONS_LOADING, ADD_CHALLENGE_QUESTION, UPDATE_CHALLENGE_QUESTION, UPDATE_CHALLENGE_QUESTION_FAIL, DELETE_CHALLENGE_QUESTION, ADD_CHALLENGE_QUESTION_FAIL, DELETE_CHALLENGE_QUESTION_FAIL } from "./challengeQuestions.types"
import axios from 'axios'
import { returnErrors } from "../../error/error.actions"
import { returnSuccess } from '../../success/success.actions'
import { tokenConfig, uploadConfig } from '../../auth/auth.actions'
import { apiURL, devApiURL } from '../../config'

// Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// Dispatches an action. This is the only way to trigger a state change.
export const getChallengeQuestions = () => async (dispatch, getState) => {
    await dispatch(getChallengeQuestionsLoading())

    try {
        await axiosInstance
            .get('/api/challengeQuestions', tokenConfig(getState))
            .then(res =>
                dispatch({
                    type: GET_CHALLENGE_QUESTIONS,
                    payload: res.data
                }))
    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err.response.status))
    }
}

// View one question
export const getOneQuestion = (chQnId) => async (dispatch) => {
    await dispatch(getChallengeQuestionsLoading())

    try {
        await axiosInstance
            .get(`/api/challengeQuestions/${chQnId}`)
            .then(res =>
                dispatch({
                    type: GET_ONE_CHALLENGE_QUESTION,
                    payload: res.data,
                }))
    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'GET_ONE_CHALLENGE_QUESTION_FAIL'))
        dispatch({ type: GET_ONE_CHALLENGE_QUESTION_FAIL })
    }
}

//instead of id it takes the whole question
export const addChQuestion = (chQuestion, onUploadProgress) => async (dispatch, getState) => {

    try {
        await axiosInstance
            .post('/api/challengeQuestions', chQuestion, uploadConfig(getState, onUploadProgress))
            .then(res =>
                dispatch({
                    type: ADD_CHALLENGE_QUESTION,
                    payload: res.data
                }))
            .then(res =>
                dispatch(
                    returnSuccess('Question created successfully! Loading ...', 200, 'ADD_CHALLENGE_QUESTION'),
                    // Reload after 3 seconds
                    window.setTimeout(() => window.location.reload(), 3000)))

    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'ADD_CHALLENGE_QUESTION_FAIL'))
        dispatch({ type: ADD_CHALLENGE_QUESTION_FAIL })
    }
}

// Update a Question
export const updateChQuestion = (qtId, updatedChQuestion, onUploadProgress) => async (dispatch, getState) => {

    try {
        await axiosInstance
            .put(`/api/challengeQuestions/${qtId}`, updatedChQuestion, uploadConfig(getState, onUploadProgress))
            .then(res =>
                dispatch({
                    type: UPDATE_CHALLENGE_QUESTION,
                    payload: updatedChQuestion
                }))
            .then(res =>
                dispatch(
                    returnSuccess('Question updated successfully!, Reloading ...', 200, 'UPDATE_CHALLENGE_QUESTION'),
                    // Reload after 4 seconds
                    window.setTimeout(() => window.location.reload(), 4000)
                ))

    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'UPDATE_CHALLENGE_QUESTION_FAIL'))
        dispatch({ type: UPDATE_CHALLENGE_QUESTION_FAIL })
    }
}

// Delete a Question
export const deleteChQuestion = id => async (dispatch, getState) => {

    try {
        if (window.confirm("This question will be deleted permanently!")) {
            await axiosInstance
                .delete(`/api/challengeQuestions/${id}`, tokenConfig(getState))
                .then(res =>
                    dispatch({
                        type: DELETE_CHALLENGE_QUESTION,
                        payload: id
                    }))
                .then(res =>
                    dispatch(
                        returnSuccess('Question deleted! Reloading ...', 200, 'DELETE_CHALLENGE_QUESTION'),
                        // Reload after 4 seconds
                        window.setTimeout(() => window.location.reload(), 4000)
                    ))
        }

    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err.response.status, 'DELETE_CHALLENGE_QUESTION_FAIL'))
        dispatch({ type: DELETE_CHALLENGE_QUESTION_FAIL })
    }
}

export const getChallengeQuestionsLoading = () => {
    //Return an action to the reducer
    return {
        //action 
        type: CHALLENGE_QUESTIONS_LOADING

    }
}