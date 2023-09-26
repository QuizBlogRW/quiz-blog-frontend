import { SET_QUESTIONS, GET_ONE_QUESTION, GET_ONE_QUESTION_FAIL, QUESTIONS_LOADING, ADD_QUESTION, UPDATE_QUESTION, UPDATE_QUESTION_FAIL, DELETE_QUESTION, ADD_QUESTION_FAIL, DELETE_QUESTION_FAIL } from "./questions.types"
import axios from 'axios'
import { returnErrors } from "../error/error.actions"
import { returnSuccess } from '../success/success.actions'
import { tokenConfig, uploadConfig } from '../auth/auth.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
})

// Dispatches an action. This is the only way to trigger a state change.
export const setQuestions = () => async (dispatch, getState) => {
    await dispatch(setQuestionsLoading())

    try {
        await axiosInstance
            .get('/api/questions', tokenConfig(getState))
            .then(res =>
                dispatch({
                    type: SET_QUESTIONS,
                    payload: res.data
                }))
    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status))
    }
}

// View one question
export const getOneQuestion = (questionId) => async (dispatch) => {
    await dispatch(setQuestionsLoading())

    try {
        await axiosInstance
            .get(`/api/questions/${questionId}`)
            .then(res =>
                dispatch({
                    type: GET_ONE_QUESTION,
                    payload: res.data,
                }))
    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_QUESTION_FAIL'))
        dispatch({ type: GET_ONE_QUESTION_FAIL })
    }
}

//instead of id it takes the whole question
export const addQuestion = (question, onUploadProgress) => async (dispatch, getState) => {

    try {
        await axiosInstance
            .post('/api/questions', question, uploadConfig(getState, onUploadProgress))
            .then(res =>
                dispatch({
                    type: ADD_QUESTION,
                    payload: res.data
                }))
            .then(res =>
                dispatch(
                    returnSuccess('Question created successfully!', 200, 'ADD_QUESTION'),
                    // Reload after 3 seconds
                    window.setTimeout(() => window.location.reload(), 3000)))

    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'ADD_QUESTION_FAIL'))
        dispatch({ type: ADD_QUESTION_FAIL })
    }
}

// Update a Question
export const updateQuestion = (qtId, updatedQuestion, onUploadProgress) => async (dispatch, getState) => {

    try {
        await axiosInstance
            .put(`/api/questions/${qtId}`, updatedQuestion, uploadConfig(getState, onUploadProgress))
            .then(res =>
                dispatch({
                    type: UPDATE_QUESTION,
                    payload: updatedQuestion
                }))
            .then(res =>
                dispatch(
                    returnSuccess('Question updated successfully!, Reloading ...', 200, 'UPDATE_QUESTION'),
                    // Reload after 4 seconds
                    window.setTimeout(() => window.location.reload(), 4000)
                ))

    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'UPDATE_QUESTION_FAIL'))
        dispatch({ type: UPDATE_QUESTION_FAIL })
    }
}

// Delete a Question
export const deleteQuestion = id => async (dispatch, getState) => {

    try {
        if (window.confirm("This question will be deleted permanently!")) {
            await axiosInstance
                .delete(`/api/questions/${id}`, tokenConfig(getState))
                .then(res =>
                    dispatch({
                        type: DELETE_QUESTION,
                        payload: id
                    }))
                .then(res =>
                    dispatch(
                        returnSuccess('Question deleted! Reloading ...', 200, 'DELETE_QUESTION'),
                        // Reload after 4 seconds
                        window.setTimeout(() => window.location.reload(), 4000)
                    ))
        }

    } catch (err) {
        dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_QUESTION_FAIL'))
        dispatch({ type: DELETE_QUESTION_FAIL })
    }
}

export const setQuestionsLoading = () => {
    //Return an action to the reducer
    return {
        //action 
        type: QUESTIONS_LOADING

    }
}