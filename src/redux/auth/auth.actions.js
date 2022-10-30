import axios from 'axios'
import { returnErrors } from '../error/error.actions'
import { returnSuccess } from '../success/success.actions'
import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, GET_USERS, UPDATE_USER, DELETE_USER, UPDATE_USER_FAIL, DELETE_USER_FAIL, USERS_LOADING, RESET_PASSWORD, FORGOT_PASSWORD, UNEXISTING_EMAIL, UPDATE_PROFILE, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_IMAGE, UPDATE_PROFILE_IMAGE_FAIL } from "./auth.types"
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
})

//HELPER FUNCTION TO GET THE TOKEN - SETUP CONFIG/headers and token
export const tokenConfig = getState => {

  // Get token from localStorage
  const token = getState().authReducer.token

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // If token, add to header
  if (token) {
    config.headers['x-auth-token'] = token
  }
  return config
}

export const uploadConfig = (getState, onUploadProgress) => {

  // Get token from localStorage
  const token = getState().authReducer.token

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }, onUploadProgress
  }

  // If token, add to header
  if (token) {
    config.headers['x-auth-token'] = token
  }
  return config
}

// Check token & load user
export const loadUser = () => (dispatch, getState) => {

  // User loading
  dispatch({ type: USER_LOADING })

  axiosInstance
    .get('/api/auth/user', tokenConfig(getState))
    .then(res => dispatch({
      type: USER_LOADED,
      payload: res.data
    }))

    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status))
      dispatch({
        type: AUTH_ERROR
      })
    })
}


// View all users
// export const getUsers = (pageNo) => async (dispatch, getState) => {
//   await dispatch(setUsersLoading())

//   try {
//     await axiosInstance
//       .get(`/api/users?pageNo=${pageNo}`, tokenConfig(getState))
//       .then(res =>
//         dispatch({
//           type: GET_USERS,
//           payload: res.data,
//         }),
//       )
//   } catch (err) {
//     dispatch(returnErrors(err.response.data, err.response.status))
//   }
// }

export const getUsers = () => async (dispatch, getState) => {
  await dispatch(setUsersLoading())

  try {
    await axiosInstance
      .get('/api/users', tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USERS,
          payload: res.data,
        }),
      )
  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status))
  }
}

// Register User
export const register = ({ name, email, password }) => dispatch => {
  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Request body
  const body = { name, email, password }

  axiosInstance.post('/api/auth/register', body, config)

    .then(res => dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    }))
    .then(res =>
      dispatch(
        returnSuccess('Registered! Reloading the page ...', 200, 'REGISTER_SUCCESS'),
        // Reload after 2 seonds
        window.setTimeout(() => window.location.reload(), 2000)
      ))


    .catch(err => {
      dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'))
      dispatch({
        type: REGISTER_FAIL
      })
    })
}

// Login User
export const login = ({ email, password }) => async dispatch => {

  // Headers
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  // Request body
  const body = { email, password }

  try {
    await axiosInstance
      .post('/api/auth/login', body, config)
      .then(res =>
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data
        }))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'))
    dispatch({ type: LOGIN_FAIL })
  }
}

// Logout user
export const logout = () => async dispatch => {
  dispatch({
    type: LOGOUT_SUCCESS
  })
}

// Update a user by Admin
export const updateUser = updatedUser => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/users/${updatedUser.uId}`, updatedUser, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_USER,
          payload: updatedUser
        }),
        alert('UPDATED!'))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_USER_FAIL'))
    dispatch({ type: UPDATE_USER_FAIL })
  }
}

// Update a user by logged in user
export const updateProfile = updatedProfile => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/users/user-details/${updatedProfile.uId}`, updatedProfile, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_PROFILE,
          payload: updatedProfile
        }))
      .then(res =>
        dispatch(
          returnSuccess('Changes are saved! Reloading the page ...', 200, 'UPDATE_PROFILE'),
          // Reload after 7 seonds
          window.setTimeout(() => window.location.reload(), 7000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UPDATE_PROFILE_FAIL'))
    dispatch({ type: UPDATE_PROFILE_FAIL })
  }
}

// export const createNotes = (newNotes, onUploadProgress) => async (dispatch, getState) => {

//   try {
//     await axiosInstance
//       .post('/api/notes', newNotes, uploadConfig(getState, onUploadProgress))
//       .then(res =>
//         dispatch({
//           type: CREATE_NOTE,
//           payload: res.data
//         }))
//       .then(res =>
//         dispatch(returnSuccess('Notes uploaded successfully!', 200, 'CREATE_NOTE')))

//   } catch (err) {
//     dispatch(returnErrors(err.response.data, err.response.status, 'CREATE_NOTE_FAIL'))
//     dispatch({ type: CREATE_NOTE_FAIL })
//   }
// }


// Update a user by logged in user
export const updateProfileImage = (updatedProfileImage, uId) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/users/user-image/${uId}`, updatedProfileImage, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: UPDATE_PROFILE_IMAGE,
          payload: updatedProfileImage
        }))
      .then(res =>
        dispatch(
          returnSuccess('Picture uploaded successfully! Reloading the page ...', 200, 'UPDATE_PROFILE_IMAGE'),
          // Reload after 10 seonds
          window.setTimeout(() => window.location.reload(), 10000)
        ))

  } catch (err) {
    dispatch(
      returnErrors(err.response.data, err.response.status, 'UPDATE_PROFILE_IMAGE_FAIL')
    )
    dispatch({ type: UPDATE_PROFILE_IMAGE_FAIL })
  }
}

// Forgot password
export const sendResetLink = fEmail => async (dispatch) => {

  try {

    await axiosInstance
      .post('/api/auth/forgot-password', fEmail)
      .then(() =>
        dispatch({
          type: FORGOT_PASSWORD,
          payload: fEmail
        }))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'UNEXISTING_EMAIL'))
    dispatch({ type: UNEXISTING_EMAIL })
  }
}

// Forgot password
export const sendNewPassword = updatePsw => async (dispatch) => {

  try {

    await axiosInstance
      .post('/api/auth/reset-password', updatePsw)
      .then(() =>
        dispatch({
          type: RESET_PASSWORD,
          payload: updatePsw
        }))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status))
  }
}


// Delete a USER
export const deleteUser = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This user will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/users/${id}`, tokenConfig(getState))
        .then(() =>
          dispatch({
            type: DELETE_USER,
            payload: id
          }),
          alert('DELETED!'))
    }

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_USER_FAIL'))
    dispatch({ type: DELETE_USER_FAIL })
  }
}

export const setUsersLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: USERS_LOADING

  }
}
