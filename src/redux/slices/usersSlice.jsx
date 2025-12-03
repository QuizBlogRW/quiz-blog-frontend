import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  apiCallHelper,
  apiCallHelperUpload,
  handlePending,
  handleRejected,
} from '../configHelpers';
import { notify } from '@/utils/notifyToast';

// Async actions with createAsyncThunk
export const loadUser = createAsyncThunk(
  'users/loadUser',
  async (_, { getState }) =>
    apiCallHelper('/api/users/loadUser', 'get', null, getState, 'loadUser')
);

export const register = createAsyncThunk(
  'users/register',
  async ({ name, email, password }, { getState }) =>
    apiCallHelper(
      '/api/users/register',
      'post',
      { name, email, password },
      getState,
      'register'
    )
);

export const verify = createAsyncThunk(
  'users/verify-otp',
  async ({ email, otp }, { getState }) =>
    apiCallHelper(
      '/api/users/verify-otp',
      'post',
      { email, otp },
      getState,
      'verify'
    )
);

export const resendOTP = createAsyncThunk(
  'users/resendOTP',
  async ({ email }, { getState }) =>
    apiCallHelper(
      '/api/users/resend-otp',
      'post',
      { email },
      getState,
      'resendOTP'
    )
);

export const login = createAsyncThunk(
  'users/login',
  async ({ email, password, confirmLogin }, { getState }) =>
    apiCallHelper(
      '/api/users/login',
      'post',
      { email, password, confirmLogin },
      getState,
      'login'
    )
);

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (_, { getState }) =>
    apiCallHelper('/api/users', 'get', null, getState, 'getUsers')
);

export const getLatestUsers = createAsyncThunk(
  'users/getLatestUsers',
  async (_, { getState }) =>
    apiCallHelper('/api/users/latest', 'get', null, getState, 'getLatestUsers')
);

export const getAdminsCreators = createAsyncThunk(
  'users/getAdminsCreators',
  async (_, { getState }) =>
    apiCallHelper(
      '/api/users/admins-creators',
      'get',
      null,
      getState,
      'getAdminsCreators'
    )
);

export const logout = createAsyncThunk(
  'users/logout',
  async (userId, { getState }) =>
    apiCallHelper('/api/users/logout', 'put', { userId }, getState, 'logout')
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (updatedUser, { getState }) =>
    apiCallHelper(
      `/api/users/${updatedUser.uId}`,
      'put',
      updatedUser,
      getState,
      'updateUser'
    )
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async (updatedProfile, { getState }) =>
    apiCallHelper(
      `/api/users/user-details/${updatedProfile.id}`,
      'put',
      updatedProfile,
      getState,
      'updateProfile'
    )
);

export const updateProfileImage = createAsyncThunk(
  'users/updateProfileImage',
  async ({ formData, id }, { getState }) =>
    apiCallHelperUpload(
      `/api/users/user-image/${id}`,
      'put',
      formData,
      getState,
      'updateProfileImage'
    )
);

export const sendResetLink = createAsyncThunk(
  'users/sendResetLink',
  async (fEmail, { getState }) =>
    apiCallHelper(
      '/api/users/forgot-password',
      'post',
      fEmail,
      getState,
      'sendResetLink'
    )
);

export const sendNewPassword = createAsyncThunk(
  'users/sendNewPassword',
  async (updatePsw, { getState }) =>
    apiCallHelper(
      '/api/users/reset-password',
      'post',
      updatePsw,
      getState,
      'sendNewPassword'
    )
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { getState }) =>
    apiCallHelper(`/api/users/${id}`, 'delete', null, getState, 'deleteUser')
);

// USERS SLICE
const usersSlice = createSlice({
  name: 'users',
  initialState: {
    isLoading: false,
    isLoadingUsers: false,
    isLoadingLatestUsers: false,
    isLoadingAdminsCreators: false,
    isAuthenticated: null,
    users: [],
    latestUsers: [],
    adminsCreators: [],
    pswdResetToken: null,
    user: null,
    token: localStorage.getItem('token'),
    confirmLogin: localStorage.getItem('confirmLogin'),
    error: null,
  },

  // We use the "reducers" property to add the createSlice actions or sync actions
  reducers: {
    setToken: (state, action) => {
      localStorage.setItem('token', action.payload);
      state.token = action.payload;
    },
    setLastLogin: (state, action) => {
      localStorage.setItem('confirmLogin', action.payload);
      state.confirmLogin = action.payload;
    },
    clearToken: (state) => {
      localStorage.removeItem('token');
      console.log('Cleared in clearToken');
      state.token = null;
    },
    clearLastLogin: (state) => {
      console.log('Cleared in clearToken');
      localStorage.removeItem('confirmLogin');
      state.confirmLogin = null;
    },
    clearPswdResetToken: (state) => {
      state.pswdResetToken = null;
    },
  },

  // We use the "extraReducers" property to add the createAsyncThunk actions or async actions
  extraReducers: (builder) => {
    // Fulfilled actions
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.isLoading = false;

      // Check if current token is still valid: Equal to the new token
      if (!action.payload.current_token || !state.token || action.payload.current_token !== state.token) {
        state.isAuthenticated = false;
        state.user = null;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else {
        state.isAuthenticated = true;

        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
        
        state.token = action.payload.current_token;
        action.payload.current_token && localStorage.setItem('token', action.payload.current_token);
      }
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.token = action.payload.current_token;
      action.payload.current_token && localStorage.setItem('token', action.payload.current_token);
      localStorage.setItem('user', JSON.stringify(action.payload));
      notify(`Welcome ${action.payload.name}!`);

      // reload after 2 seconds
      // setTimeout(() => window.location.reload(), 2000);
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      const { user, message } = action.payload;
      user?.email && localStorage.setItem('emailForOTP', user?.email);
      notify(message);
      setTimeout(() => (window.location.href = '/verify'), 3000);
    });
    builder.addCase(verify.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;

      state.user = action.payload;
      action.payload.user && localStorage.setItem('user', JSON.stringify(action.payload));

      state.token = action.payload.current_token;
      action.payload.current_token && localStorage.setItem('token', action.payload.current_token);
      notify('Account verified! Welcome to Quiz-Blog!');
    });
    builder.addCase(resendOTP.fulfilled, (state, action) => {
      state.isLoading = false;
      const { user, message } = action.payload;
      console.log(user)
      user?.email && localStorage.setItem('emailForOTP', user?.email);
      notify(message);
      setTimeout(() => (window.location.href = '/verify'), 3000);
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.confirmLogin = null;
      console.log('Cleared in logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('confirmLogin');
      notify('Good Bye!');
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.isLoadingUsers = false;
      state.users = action.payload;
    });
    builder.addCase(getLatestUsers.fulfilled, (state, action) => {
      state.isLoadingLatestUsers = false;
      state.latestUsers = action.payload;
    });
    builder.addCase(getAdminsCreators.fulfilled, (state, action) => {
      state.isLoadingAdminsCreators = false;
      state.adminsCreators = action.payload;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
      state.adminsCreators = state.adminsCreators.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
      state.latestUsers = state.latestUsers.map((user) =>
        user._id === action.payload._id ? action.payload : user
      );
      state.isLoading = false;
      state.isLoadingUsers = false;
      state.isLoadingLatestUsers = false;
      state.isLoadingAdminsCreators = false;
    });
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    });
    builder.addCase(updateProfileImage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      notify('Profile image updated!');
    });
    builder.addCase(sendResetLink.fulfilled, (state, action) => {
      state.isLoading = false;
      state.email = action.payload;
      notify(
        'Password reset link sent to your email! Can\'t find it? Check your spam folder.'
      );
    });
    builder.addCase(sendNewPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      notify('Password reset successful! Please login with your new password.');
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(
        (user) => user._id !== action.payload._id
      );
      state.latestUsers = state.latestUsers.filter(
        (user) => user._id !== action.payload._id
      );
      state.adminsCreators = state.adminsCreators.filter(
        (user) => user._id !== action.payload._id
      );
      state.isLoading = false;
      state.isLoadingUsers = false;
      state.isLoadingLatestUsers = false;
      state.isLoadingAdminsCreators = false;
    });

    // Pending actions
    builder.addCase(loadUser.pending, handlePending);
    builder.addCase(login.pending, handlePending);
    builder.addCase(register.pending, handlePending);
    builder.addCase(verify.pending, handlePending);
    builder.addCase(getUsers.pending, (state) => {
      state.isLoadingUsers = true;
    });
    builder.addCase(getLatestUsers.pending, (state) => {
      state.isLoadingLatestUsers = true;
    });
    builder.addCase(getAdminsCreators.pending, (state) => {
      state.isLoadingAdminsCreators = true;
    });
    builder.addCase(logout.pending, handlePending);
    builder.addCase(resendOTP.pending, handlePending);
    builder.addCase(updateUser.pending, handlePending);
    builder.addCase(updateProfile.pending, handlePending);
    builder.addCase(updateProfileImage.pending, handlePending);
    builder.addCase(sendResetLink.pending, handlePending);
    builder.addCase(sendNewPassword.pending, handlePending);
    builder.addCase(deleteUser.pending, handlePending);

    // Rejected actions
    builder.addCase(loadUser.rejected, handleRejected);
    builder.addCase(login.rejected, handleRejected);
    builder.addCase(register.rejected, handleRejected);
    builder.addCase(verify.rejected, handleRejected);
    builder.addCase(getUsers.rejected, (state) => {
      state.isLoadingUsers = false;
    });
    builder.addCase(getLatestUsers.rejected, (state) => {
      state.isLoadingLatestUsers = false;
    });
    builder.addCase(getAdminsCreators.rejected, (state) => {
      state.isLoadingAdminsCreators = false;
    });
    builder.addCase(logout.rejected, handleRejected);
    builder.addCase(resendOTP.rejected, handleRejected);
    builder.addCase(updateUser.rejected, handleRejected);
    builder.addCase(updateProfile.rejected, handleRejected);
    builder.addCase(updateProfileImage.rejected, handleRejected);
    builder.addCase(sendResetLink.rejected, handleRejected);
    builder.addCase(sendNewPassword.rejected, handleRejected);
    builder.addCase(deleteUser.rejected, handleRejected);
  },
});

// Export the actions
export const {
  setToken,
  setLastLogin,
  clearToken,
  clearLastLogin,
  clearPswdResetToken,
} = usersSlice.actions;

// Export the reducer
export default usersSlice.reducer;
