import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'
import { notify } from '../../utils/notifyToast'

// Async actions with createAsyncThunk
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { getState }) =>
  apiCallHelper('/api/users/loadUser', 'get', null, getState, 'loadUser'))

export const register = createAsyncThunk("auth/register", async ({ name, email, password }, { getState }) =>
  apiCallHelper('/api/users/register', 'post', { name, email, password }, getState, 'register'))

export const verify = createAsyncThunk("auth/verify-otp", async ({ email, otp }, { getState }) =>
  apiCallHelper('/api/users/verify-otp', 'post', { email, otp }, getState, 'verify'))

export const login = createAsyncThunk("auth/login", async ({ email, password, confirmLogin }, { getState }) =>
  apiCallHelper('/api/users/login', 'post', { email, password, confirmLogin }, getState, 'login'))

export const getUsers = createAsyncThunk("auth/getUsers", async (_, { getState }) =>
  apiCallHelper('/api/users', 'get', null, getState, 'getUsers'))

export const logout = createAsyncThunk("auth/logout", async (userId, { getState }) =>
  apiCallHelper('/api/users/logout', 'put', { userId }, getState, 'logout'))

export const updateUser = createAsyncThunk("auth/updateUser", async (updatedUser, { getState }) =>
  apiCallHelper(`/api/users/${updatedUser.uId}`, 'put', updatedUser, getState, 'updateUser'))

export const updateProfile = createAsyncThunk("auth/updateProfile", async (updatedProfile, { getState }) =>
  apiCallHelper(`/api/users/user-details/${updatedProfile.uId}`, 'put', updatedProfile, getState, 'updateProfile'))

export const updateProfileImage = createAsyncThunk("auth/updateProfileImage", async ({ formData, uId }, { getState }) =>
  apiCallHelperUpload(`/api/users/user-image/${uId}`, 'put', formData, getState, 'updateProfileImage'))

export const sendResetLink = createAsyncThunk("auth/sendResetLink", async (fEmail, { getState }) =>
  apiCallHelper('/api/auth/forgot-password', 'post', fEmail, getState, 'sendResetLink'))

export const sendNewPassword = createAsyncThunk("auth/sendNewPassword", async (updatePsw, { getState }) =>
  apiCallHelper('/api/auth/reset-password', 'post', updatePsw, getState, 'sendNewPassword'))

export const deleteUser = createAsyncThunk("auth/deleteUser", async (id, { getState }) =>
  apiCallHelper(`/api/users/${id}`, 'delete', null, getState, 'deleteUser'))

// AUTH SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoading: false,
    isAuthenticated: null,
    users: [],
    pswdResetToken: null,
    user: null,
    token: localStorage.getItem('token'),
    confirmLogin: localStorage.getItem('confirmLogin'),
    error: null
  },

  // We use the "reducers" property to add the createSlice actions or sync actions
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload)
      state.token = action.payload
    },
    setLastLogin: (state, action) => {
      localStorage.setItem('confirmLogin', action.payload)
      state.confirmLogin = action.payload
    },
    clearToken: (state, action) => {
      localStorage.removeItem('token')
      state.token = null
    },
    clearLastLogin: (state, action) => {
      localStorage.removeItem('confirmLogin')
      state.confirmLogin = null
    },
    clearPswdResetToken: (state, action) => {
      state.pswdResetToken = null
    }
  },

  // We use the "extraReducers" property to add the createAsyncThunk actions or async actions
  extraReducers: (builder) => {

    // Fulfilled actions
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.isLoading = false

      // check if current token is still valid. if not, logout user
      if (!action.payload.current_token || !state.token || action.payload.current_token !== state.token) {
        state.isAuthenticated = false
        state.user = null
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        if (window.location.pathname !== '/forgot-password' && window.location.pathname !== '/reset-password' && window.location.pathname !== '/') {
          notify('You are not authorized, Please login again!', 'error')
        }
      }

      else {
        state.isAuthenticated = true
        state.user = action.payload
      }
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.current_token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      notify(`Welcome back ${action.payload.user.name}!`)
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false
      const { email, msg } = action.payload
      localStorage.setItem('emailForOTP', email)
      notify(msg)
      setTimeout(() => window.location.href = '/verify', 5000)
    })
    builder.addCase(verify.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.current_token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
      notify('Account verified! Welcome to Quiz-Blog!')
    })
    builder.addCase(logout.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.user = null
      state.token = null
      state.confirmLogin = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('confirmLogin')
      notify('Good Bye!')
    })
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.isLoading = false
      state.users = action.payload
    })
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload.user
    })
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
      notify('Profile image updated!')
    })
    builder.addCase(sendResetLink.fulfilled, (state, action) => {
      state.isLoading = false
      state.email = action.payload
      notify('Password reset link sent to your email! Can\'t find it? Check your spam folder.')
    })
    builder.addCase(sendNewPassword.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
      notify('Password reset successful! Please login with your new password.')
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.users = state.users.filter(user => user._id !== action.payload)
    })

    // Pending actions
    builder.addMatcher(
      (action) => [loadUser.pending, login.pending, register.pending, verify.pending, getUsers.pending, logout.pending, updateUser.pending, updateProfile.pending, updateProfileImage.pending, sendResetLink.pending, sendNewPassword.pending, deleteUser.pending].includes(action.type),
      (state) => {
        state.isLoading = true
      })

    // Rejected actions
    builder.addMatcher(
      (action) => [loadUser.rejected, login.rejected, register.rejected, verify.rejected, getUsers.rejected, logout.rejected, updateUser.rejected, updateProfile.rejected, updateProfileImage.rejected, sendResetLink.rejected, sendNewPassword.rejected, deleteUser.rejected].includes(action.type),
      (state) => {
        state.isLoading = false

        if (action.type.includes('loadUser') || action.type.includes('login') || action.type.includes('register') || action.type.includes('verify')) {
          state.isAuthenticated = false
          state.user = null
          state.users = []
          localStorage.getItem('token') && localStorage.removeItem('token')
          localStorage.getItem('user') && localStorage.removeItem('user')
          state.error = action.payload
          console.log(state.error )
        }
      })
  }
})

// Export the actions
export const { setToken, setLastLogin, clearToken, clearLastLogin, clearPswdResetToken } = authSlice.actions

// Export the reducer
export default authSlice.reducer