import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const loadUser = createAsyncThunk("auth/loadUser", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/auth/user', 'get', null, getState, dispatch, 'loadUser'))

export const register = createAsyncThunk("auth/register", async ({ name, email, password }, { getState, dispatch }) =>
  apiCallHelper('/api/auth/register', 'post', { name, email, password }, getState, dispatch, 'register'))

export const login = createAsyncThunk("auth/login", async ({ email, password, confirmLogin }, { getState, dispatch }) =>
  apiCallHelper('/api/auth/login', 'post', { email, password, confirmLogin }, getState, dispatch, 'login'))

export const getUsers = createAsyncThunk("auth/getUsers", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/users', 'get', null, getState, dispatch, 'getUsers'))

export const logout = createAsyncThunk("auth/logout", async (userId, { getState, dispatch }) =>
  apiCallHelper('/api/auth/logout', 'put', { userId }, getState, dispatch, 'logout'))

export const updateUser = createAsyncThunk("auth/updateUser", async (updatedUser, { getState, dispatch }) =>
  apiCallHelper(`/api/users/${updatedUser.uId}`, 'put', updatedUser, getState, dispatch, 'updateUser'))

export const updateProfile = createAsyncThunk("auth/updateProfile", async (updatedProfile, { getState, dispatch }) =>
  apiCallHelper(`/api/users/user-details/${updatedProfile.uId}`, 'put', updatedProfile, getState, dispatch, 'updateProfile'))

export const updateProfileImage = createAsyncThunk("auth/updateProfileImage", async ({ formData, uId }, { getState, dispatch }) =>
  apiCallHelperUpload(`/api/users/user-image/${uId}`, 'put', formData, getState, dispatch, 'updateProfileImage'))

export const sendResetLink = createAsyncThunk("auth/sendResetLink", async (fEmail, { getState, dispatch }) =>
  apiCallHelper('/api/auth/forgot-password', 'post', fEmail, getState, dispatch, 'sendResetLink'))

export const sendNewPassword = createAsyncThunk("auth/sendNewPassword", async (updatePsw, { getState, dispatch }) =>
  apiCallHelper('/api/auth/reset-password', 'post', updatePsw, getState, dispatch, 'sendNewPassword'))

export const deleteUser = createAsyncThunk("auth/deleteUser", async (id, { getState, dispatch }) =>
  apiCallHelper(`/api/users/${id}`, 'delete', null, getState, dispatch, 'deleteUser'))

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
      state.user = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.current_token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    })
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.current_token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
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
      state.user = action.payload
    })
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
    })
    builder.addCase(sendResetLink.fulfilled, (state, action) => {
      state.isLoading = false
      state.email = action.payload
    })
    builder.addCase(sendNewPassword.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
    })
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.users = state.users.filter(user => user._id !== action.payload)
    })

    // Pending actions
    builder.addCase(loadUser.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(login.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(register.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(logout.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getUsers.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateUser.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateProfile.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(updateProfileImage.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(sendResetLink.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(sendNewPassword.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteUser.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(loadUser.rejected, (state, action) => {
      state.isAuthenticated = false
      state.isLoading = false
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    })
    builder.addCase(login.rejected, (state, action) => {
      state.isAuthenticated = false
      state.isLoading = false
    })
    builder.addCase(register.rejected, (state, action) => {
      state.isAuthenticated = false
      state.isLoading = false
    })
    builder.addCase(logout.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getUsers.rejected, (state, action) => {
      state.isLoading = false
      state.users = []
    })
    builder.addCase(updateUser.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(updateProfileImage.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(sendResetLink.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(sendNewPassword.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.isLoading = false
    })
  }
})

// Export the actions
export const { setToken, setLastLogin, clearToken, clearLastLogin, clearPswdResetToken } = authSlice.actions

// Export the reducer
export default authSlice.reducer