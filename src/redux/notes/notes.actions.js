import axios from 'axios'
import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import {
  GET_NOTES, GET_NOTES_FAIL, GET_NOTES_BY_CHAPTER_FAIL, NOTES_BY_CHAPTER_LOADING, GET_NOTES_BY_CHAPTER, CREATE_NOTE, CREATE_NOTE_FAIL, DELETE_NOTE, DELETE_NOTE_FAIL, UPDATE_NOTE, UPDATE_NOTE_FAIL, NOTES_LOADING, GET_LANDING_DISPLAY_NOTES, GET_LANDING_DISPLAY_NOTES_FAIL, LANDING_DISPLAY_NOTES_LOADING, GET_ONE_NOTE_PAPER, GET_ONE_NOTE_PAPER_FAIL, GET_ONE_NOTE_PAPER_LOADING, GET_LANDING_DISPLAY_NO_LIMIT_NOTES, GET_LANDING_DISPLAY_NO_LIMIT_NOTES_FAIL, LANDING_DISPLAY_NOTES_NO_LIMIT_LOADING, GET_NOTES_BY_COURSE_CATEGORY_FAIL,
  GET_NOTES_BY_COURSE_CATEGORY, NOTES_BY_COURSE_CATEGORY_LOADING, ADD_NOTES_QUIZZES, ADD_NOTES_QUIZZES_FAIL, REMOVE_QUIZ_NOTES, REMOVE_QUIZ_NOTES_FAIL
} from "./notes.types"
import { tokenConfig, uploadConfig } from '../auth/auth.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

// View all notes
export const getNotes = () => async (dispatch, getState) => {
  await dispatch(getNotesLoading())

  try {
    await axiosInstance
      .get('/api/notes', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTES,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_NOTES_FAIL'))
    dispatch({ type: GET_NOTES_FAIL })
  }
}

// View limited landing notes
export const getLandingDisplayNotes = (limit) => async (dispatch) => {
  await dispatch(getLandingDisplayNotesLoading())

  try {
    await axiosInstance
      .get(`/api/notes/landingDisplay?limit=${limit}`)
      .then(res =>
        dispatch({
          type: GET_LANDING_DISPLAY_NOTES,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_LANDING_DISPLAY_NOTES_FAIL'))
    dispatch({ type: GET_LANDING_DISPLAY_NOTES_FAIL })
  }
}

// View all landing notes
export const getLandingDisplayNotesNoLimit = () => async (dispatch) => {
  await dispatch(getLandingDisplayNotesLoadingNoLimit())

  try {
    await axiosInstance
      .get(`/api/notes/landingDisplay`)
      .then(res =>
        dispatch({
          type: GET_LANDING_DISPLAY_NO_LIMIT_NOTES,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response.data, err && err.response.status, 'GET_LANDING_DISPLAY_NO_LIMIT_NOTES_FAIL'))
    dispatch({ type: GET_LANDING_DISPLAY_NO_LIMIT_NOTES_FAIL })
  }
}

// View notes by course category
export const getNotesByCCatg = (ccatgID) => async (dispatch, getState) => {
  await dispatch(getNotesByCCatgLoading())

  try {
    await axiosInstance
      .get(`/api/notes/ccatg/${ccatgID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTES_BY_COURSE_CATEGORY,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_NOTES_BY_COURSE_CATEGORY_FAIL'))
    dispatch({ type: GET_NOTES_BY_COURSE_CATEGORY_FAIL })
  }
}

// View notes by chapter
export const getNotesByChapter = (chapterId) => async (dispatch, getState) => {
  await dispatch(getNotesByChapterLoading())

  try {
    await axiosInstance
      .get(`/api/notes/chapter/${chapterId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTES_BY_CHAPTER,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_NOTES_BY_CHAPTER_FAIL'))
    dispatch({ type: GET_NOTES_BY_CHAPTER_FAIL })
  }
}

// View one note
export const getOneNotePaper = (noteSlug) => async (dispatch, getState) => {
  await dispatch(getOneNotePaperLoading())

  try {
    await axiosInstance
      .get(`/api/notes/${noteSlug}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_NOTE_PAPER,
          payload: res.data,
        })
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_ONE_NOTE_PAPER_FAIL'))
    dispatch({ type: GET_ONE_NOTE_PAPER_FAIL })
  }
}

// Create notes
export const createNotes = (newNotes, onUploadProgress) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/notes', newNotes, uploadConfig(getState, onUploadProgress))
      .then(res =>
        dispatch({
          type: CREATE_NOTE,
          payload: res.data
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Notes uploaded! Reloading the page ...', 200, 'CREATE_NOTE'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_NOTE_FAIL'))
    dispatch({ type: CREATE_NOTE_FAIL })
  }
}

// Update a notes
export const updateNotes = (updatedNotes, idToUpdate, onUploadProgress) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/notes/${idToUpdate}`, updatedNotes, uploadConfig(getState, onUploadProgress))
      .then(() =>
        dispatch({
          type: UPDATE_NOTE,
          payload: updatedNotes
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Notes updated! Reloading the page ...', 200, 'UPDATE_NOTE'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_NOTE_FAIL'))
    dispatch({ type: UPDATE_NOTE_FAIL })
  }
}


// Update a notes
export const addNotesQuizes = notesQuizzes => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/notes/notes-quizzes/${notesQuizzes.noteID}`, notesQuizzes, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: ADD_NOTES_QUIZZES,
          payload: notesQuizzes
        }))
      // Reload the page
      .then(res =>
        dispatch(
          returnSuccess('Notes updated! Reloading the page ...', 200, 'ADD_NOTES_QUIZZES'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'ADD_NOTES_QUIZZES_FAIL'))
    dispatch({ type: ADD_NOTES_QUIZZES_FAIL })
  }
}

// Delete a notes
export const deleteNotes = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This notes will be deleted permanently!")) {
      await axiosInstance.delete(`/api/notes/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_NOTE,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Notes deleted! Reloading the page ...', 200, 'DELETE_NOTE'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_NOTE_FAIL'))
    dispatch({ type: DELETE_NOTE_FAIL })
  }
}

// Delete a quiz from notes
export const removeQzNt = (noteID, quizID) => async (dispatch, getState) => {

  try {
    if (window.confirm("This quiz will be removed from this notes!")) {
      await axiosInstance.put(`/api/notes/notes-quizzes/remove/${noteID}`, { noteID, quizID }, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: REMOVE_QUIZ_NOTES,
            payload: { noteID, quizID }
          }))
        .then(res =>
          dispatch(
            returnSuccess('Quiz removed! Reloading the page ...', 200, 'REMOVE_QUIZ_NOTES'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'REMOVE_QUIZ_NOTES_FAIL'))
    dispatch({ type: REMOVE_QUIZ_NOTES_FAIL })
  }
}

export const getNotesLoading = () => {
  //Return an action to the reducer
  return {
    type: NOTES_LOADING
  }
}

export const getLandingDisplayNotesLoading = () => {
  //Return an action to the reducer
  return {
    type: LANDING_DISPLAY_NOTES_LOADING
  }
}

export const getLandingDisplayNotesLoadingNoLimit = () => {
  //Return an action to the reducer
  return {
    type: LANDING_DISPLAY_NOTES_NO_LIMIT_LOADING
  }
}

export const getOneNotePaperLoading = () => {
  //Return an action to the reducer
  return {
    type: GET_ONE_NOTE_PAPER_LOADING
  }
}

export const getNotesByChapterLoading = () => {
  //Return an action to the reducer
  return {
    type: NOTES_BY_CHAPTER_LOADING
  }
}

export const getNotesByCCatgLoading = () => {
  //Return an action to the reducer
  return {
    type: NOTES_BY_COURSE_CATEGORY_LOADING
  }
}