import axios from 'axios'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { GET_50_NEW_USERS, GET_50_NEW_USERS_FAIL, NEW_50_USERS_LOADING, GET_ALL_USERS, GET_ALL_USERS_FAIL, ALL_USERS_LOADING, GET_USERS_WITH_IMAGE, GET_USERS_WITH_IMAGE_FAIL, USERS_WITH_IMAGE_LOADING, GET_USERS_WITH_SCHOOL, GET_USERS_WITH_SCHOOL_FAIL, GET_USERS_WITH_LEVEL, GET_USERS_WITH_LEVEL_FAIL, GET_USERS_WITH_FACULTY, GET_USERS_WITH_FACULTY_FAIL, GET_USERS_WITH_INTERESTS, GET_USERS_WITH_INTERESTS_FAIL, GET_USERS_WITH_ABOUT, GET_USERS_WITH_ABOUT_FAIL, GET_TOP_100_QUIZZING_USERS, GET_TOP_100_QUIZZING_USERS_FAIL, GET_TOP_100_DOWNLOADERS, GET_TOP_100_DOWNLOADERS_FAIL, GET_TOP_20_QUIZZES, GET_TOP_20_QUIZZES_FAIL, GET_QUIZZES_STATS, GET_QUIZZES_STATS_FAIL, GET_TOP_20_NOTES, GET_TOP_20_NOTES_FAIL, GET_NOTES_STATS, GET_NOTES_STATS_FAIL, USERS_WITH_SCHOOL_LOADING, USERS_WITH_LEVEL_LOADING, USERS_WITH_FACULTY_LOADING, USERS_WITH_INTERESTS_LOADING, USERS_WITH_ABOUT_LOADING, TOP_100_QUIZZING_USERS_LOADING, TOP_100_DOWNLOADERS_LOADING, TOP_20_QUIZZES_LOADING, QUIZZES_STATS_LOADING, TOP_20_NOTES_LOADING, NOTES_STATS_LOADING, GET_QUIZ_CATEGORIES_STATS, GET_QUIZ_CATEGORIES_STATS_FAIL, QUIZ_CATEGORIES_STATS_LOADING, GET_NOTE_CATEGORIES_STATS, GET_NOTE_CATEGORIES_STATS_FAIL, NOTE_CATEGORIES_STATS_LOADING, GET_DAILY_USER_REGISTRATION, GET_DAILY_USER_REGISTRATION_FAIL, DAILY_USER_REGISTRATION_LOADING } from "./statistics.types"
import { tokenConfig } from '../auth/auth.actions'
import { qbURL, apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? (qbURL || devApiURL) : apiURL,
})

// GETTERS
// View 50 new users
export const get50NewUsers = () => async (dispatch, getState) => {
  await dispatch(get50NewUsersLoading())
  console.log(`The qbURL is ${qbURL}`);

  try {
    await axiosInstance
      .get('/api/statistics/users50', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_50_NEW_USERS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_50_NEW_USERS')))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_50_NEW_USERS_FAIL'))
    dispatch({ type: GET_50_NEW_USERS_FAIL })
  }
}


// View all users
export const getAllUsers = () => async (dispatch, getState) => {
  await dispatch(getAllUsersLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersAll', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ALL_USERS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_ALL_USERS')))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ALL_USERS_FAIL'))
    dispatch({ type: GET_ALL_USERS_FAIL })
  }
}

// View users with image
export const getUsersWithImage = () => async (dispatch, getState) => {
  await dispatch(geUsersWithImageLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersWithImage', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS_WITH_IMAGE,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_USERS_WITH_IMAGE')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USERS_WITH_IMAGE_FAIL'))
    dispatch({ type: GET_USERS_WITH_IMAGE_FAIL })
  }
}

// View users with school
export const getUsersWithSchool = () => async (dispatch, getState) => {
  await dispatch(getUsersWithSchoolLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersWithSchool', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS_WITH_SCHOOL,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_USERS_WITH_SCHOOL')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USERS_WITH_SCHOOL_FAIL'))
    dispatch({ type: GET_USERS_WITH_SCHOOL_FAIL })
  }
}

// View users with level
export const getUsersWithLevel = () => async (dispatch, getState) => {
  await dispatch(getUsersWithLevelLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersWithLevel', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS_WITH_LEVEL,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_USERS_WITH_LEVEL')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USERS_WITH_LEVEL_FAIL'))
    dispatch({ type: GET_USERS_WITH_LEVEL_FAIL })
  }
}

// View users with faculty
export const getUsersWithFaculty = () => async (dispatch, getState) => {
  await dispatch(getUsersWithFacultyLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersWithFaculty', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS_WITH_FACULTY,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_USERS_WITH_FACULTY')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USERS_WITH_FACULTY_FAIL'))
    dispatch({ type: GET_USERS_WITH_FACULTY_FAIL })
  }
}

// View users with interest
export const getUsersWithInterests = () => async (dispatch, getState) => {
  await dispatch(getUsersWithInterestsLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersWithInterests', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS_WITH_INTERESTS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_USERS_WITH_INTERESTS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USERS_WITH_INTERESTS_FAIL'))
    dispatch({ type: GET_USERS_WITH_INTERESTS_FAIL })
  }
}

// View users with about
export const getUsersWithAbout = () => async (dispatch, getState) => {
  await dispatch(getUsersWithAboutLoading())

  try {
    await axiosInstance
      .get('/api/statistics/usersWithAbout', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS_WITH_ABOUT,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_USERS_WITH_ABOUT')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USERS_WITH_ABOUT_FAIL'))
    dispatch({ type: GET_USERS_WITH_ABOUT_FAIL })
  }
}

// View top 100 quizzing
export const getTop100Quizzing = () => async (dispatch, getState) => {
  await dispatch(getTop100QuizzingLoading())

  try {
    await axiosInstance
      .get('/api/statistics/top100Quizzing', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_TOP_100_QUIZZING_USERS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_TOP_100_QUIZZING_USERS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_TOP_100_QUIZZING_USERS_FAIL'))
    dispatch({ type: GET_TOP_100_QUIZZING_USERS_FAIL })
  }
}

// View top 100 downloaders
export const getTop100Downloaders = () => async (dispatch, getState) => {
  await dispatch(getTop100DownloadersLoading())

  try {
    await axiosInstance
      .get('/api/statistics/top100Downloaders', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_TOP_100_DOWNLOADERS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_TOP_100_DOWNLOADERS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_TOP_100_DOWNLOADERS_FAIL'))
    dispatch({ type: GET_TOP_100_DOWNLOADERS_FAIL })
  }
}

// View top 20 quizzes
export const getTop20Quizzes = () => async (dispatch, getState) => {
  await dispatch(getTop20QuizzesLoading())

  try {
    await axiosInstance
      .get('/api/statistics/top20Quizzes', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_TOP_20_QUIZZES,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_TOP_20_QUIZZES')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_TOP_20_QUIZZES_FAIL'))
    dispatch({ type: GET_TOP_20_QUIZZES_FAIL })
  }
}

// View quizzes stats
export const getQuizzesStats = () => async (dispatch, getState) => {
  await dispatch(getQuizzesStatsLoading())

  try {
    await axiosInstance
      .get('/api/statistics/allQuizzesAttempts', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_QUIZZES_STATS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_QUIZZES_STATS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_QUIZZES_STATS_FAIL'))
    dispatch({ type: GET_QUIZZES_STATS_FAIL })
  }
}

// View top 20 notes
export const getTop20Notes = () => async (dispatch, getState) => {
  await dispatch(getTop20NotesLoading())

  try {
    await axiosInstance
      .get('/api/statistics/top20Downloads', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_TOP_20_NOTES,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_TOP_20_NOTES')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_TOP_20_NOTES_FAIL'))
    dispatch({ type: GET_TOP_20_NOTES_FAIL })
  }
}


// View notes stats
export const getNotesStats = () => async (dispatch, getState) => {
  await dispatch(getNotesStatsLoading())

  try {
    await axiosInstance
      .get('/api/statistics/allDownloads', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTES_STATS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_NOTES_STATS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_NOTES_STATS_FAIL'))
    dispatch({ type: GET_NOTES_STATS_FAIL })
  }
}

// View quiz categories stats
export const getQuizCategoriesStats = () => async (dispatch, getState) => {
  await dispatch(getQuizCategoriesStatsLoading())

  try {
    await axiosInstance
      .get('/api/statistics/quizCategoriesAttempts', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_QUIZ_CATEGORIES_STATS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_QUIZ_CATEGORIES_STATS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_QUIZ_CATEGORIES_STATS_FAIL'))
    dispatch({ type: GET_QUIZ_CATEGORIES_STATS_FAIL })
  }
}

// View note categories stats
export const getNotesCategoriesStats = () => async (dispatch, getState) => {
  await dispatch(getNotesCategoriesStatsLoading())

  try {
    await axiosInstance
      .get('/api/statistics/notesCategoriesDownloads', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_NOTE_CATEGORIES_STATS,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_NOTE_CATEGORIES_STATS')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_NOTE_CATEGORIES_STATS_FAIL'))
    dispatch({ type: GET_NOTE_CATEGORIES_STATS_FAIL })
  }
}

// View daily user registration
export const getDailyUserRegistration = () => async (dispatch, getState) => {
  await dispatch(getDailyUserRegistrationLoading())

  try {
    await axiosInstance
      .get('/api/statistics/dailyUserRegistration', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_DAILY_USER_REGISTRATION,
          payload: res.data,
        }))
      .then(res =>
        dispatch(
          returnSuccess('Success', 200, 'GET_DAILY_USER_REGISTRATION')))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err && err.response && err.response.data, err && err.response && err.response.status, 'GET_DAILY_USER_REGISTRATION_FAIL'))
    dispatch({ type: GET_DAILY_USER_REGISTRATION_FAIL })
  }
}


// LOADING
export const get50NewUsersLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: NEW_50_USERS_LOADING

  }
}

export const getAllUsersLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: ALL_USERS_LOADING

  }
}

export const geUsersWithImageLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_WITH_IMAGE_LOADING

  }
}

export const getUsersWithSchoolLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_WITH_SCHOOL_LOADING

  }
}

export const getUsersWithLevelLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_WITH_LEVEL_LOADING

  }
}

export const getUsersWithFacultyLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_WITH_FACULTY_LOADING

  }
}

export const getUsersWithInterestsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_WITH_INTERESTS_LOADING

  }
}

export const getUsersWithAboutLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_WITH_ABOUT_LOADING

  }
}

export const getTop100QuizzingLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: TOP_100_QUIZZING_USERS_LOADING

  }
}

export const getTop100DownloadersLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: TOP_100_DOWNLOADERS_LOADING

  }
}

export const getTop20QuizzesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: TOP_20_QUIZZES_LOADING

  }
}

export const getTop20NotesLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: TOP_20_NOTES_LOADING

  }
}

export const getQuizzesStatsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: QUIZZES_STATS_LOADING

  }
}

export const getNotesStatsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: NOTES_STATS_LOADING

  }
}

export const getQuizCategoriesStatsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: QUIZ_CATEGORIES_STATS_LOADING

  }
}

export const getNotesCategoriesStatsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: NOTE_CATEGORIES_STATS_LOADING

  }
}

export const getDailyUserRegistrationLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: DAILY_USER_REGISTRATION_LOADING

  }
}