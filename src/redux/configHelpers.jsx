import axios from 'axios';
import { notify } from '@/utils/notifyToast';

// REAL GLOBAL - survives imports
if (!window.__TOAST_CONTROL__) {
  window.__TOAST_CONTROL__ = {
    success: false,
    error: false,
    retryNotified: false,   // <-- add this
  };
}


// Environment-based URLs
export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/';
export const testURL = 'https://qb-backend-one.vercel.app/';
export const devApiURL = 'http://localhost:5000/';

// Use environment variables if available, fallback to hardcoded URLs
const getApiUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    console.log('🔧 Using VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
    return import.meta.env.VITE_BACKEND_URL;
  }
  const fallbackUrl =
    import.meta.env.MODE === 'development' ? devApiURL : import.meta.env.MODE === 'test' ? testURL : qbURL;
  console.log('🔧 Using fallback URL:', fallbackUrl);
  return fallbackUrl;
};

// Axios instance
export const axiosInstance = axios.create({
  baseURL: getApiUrl(),
});

// Add request interceptor for debugging
if (import.meta.env.VITE_DEBUG === 'true') {
  axiosInstance.interceptors.request.use((request) => {
    return request;
  });

  // Log responses
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log('✅ API Response:', response.status, response.config?.url);
      return response;
    },
    (error) => {
      if (!error.response?.status) {
        console.error('❌ API Error status:', error);
      }
      console.error('❌ API Error:', error);
      // Build the error object with code, message, status
      const errorObject = {
        code: error.response?.code || error?.code,
        name: error.response?.name || error?.name,
        message: error.response?.data?.message || error?.message || 'Unknown error',
        status: error.response?.status || error?.status,
      };
      console.error('❌ API Error Object:', errorObject);
      return Promise.reject(errorObject);
    }
  );
}

// List of action types that doesn't require a reload
const reloadActionTypes = ['verify', 'login'];
const noToastActionTypes = ['loadUser', 'createBlogPostView'];

// Default reload timeout
const RELOAD_TIMEOUT = 2000;

// API call helper function to make async actions with createAsyncThunk
export const apiCallHelper = async (
  url,
  method,
  body,
  getState,
  actionType,
  retries = 3,
  retryDelay = 5000
) => {
  const headers = {
    'x-auth-token': getState().auth.token,
    'Content-Type': 'application/json',
  };

  let attempt = 0;
  let hasNotifiedRetry = false;

  while (attempt <= retries) {
    try {
      const response =
        method === 'get' || method === 'delete'
          ? await axiosInstance[method](url, { headers })
          : await axiosInstance[method](url, body, { headers });

      // Success notification
      if ((response.status === 200 || response.status === 201) && method !== 'get') {
        if (reloadActionTypes.includes(actionType)) {
          setTimeout(() => window.location.reload(), RELOAD_TIMEOUT);
        } else if (!noToastActionTypes.includes(actionType)) {

          // Only notify once globally per page load
          if (!window.__TOAST_CONTROL__.success) {
            notify(
              response.data?.message || `${method.toUpperCase()} successfully!`,
              'success'
            );
            window.__TOAST_CONTROL__.success = true;
          }
        }
      }

      return response.data;
    } catch (error) {
      const code = error?.response?.code || error?.code || 'UNKNOWN_ERROR';
      const isNetworkError =
        code === 'ERR_NETWORK' ||
        code === 'ECONNREFUSED' ||
        code === 'ECONNABORTED';

      attempt++;

      if (isNetworkError && attempt <= retries) {
        if (!window.__TOAST_CONTROL__.retryNotified) {
          notify(`Network error, retrying in ${retryDelay / 1000}s...`, 'error');
          window.__TOAST_CONTROL__.retryNotified = true;
        }

        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      const message =
        error?.response?.data?.message || error?.message || 'Unknown error';

      // Only notify once globally per page load
      if (!noToastActionTypes.includes(actionType) && !window.__TOAST_CONTROL__.error) {
        notify(message, 'error');
        window.__TOAST_CONTROL__.error = true;
      }

      throw { message, code: error.code, status: error?.response?.status };
    }
  }
};


// API call helper function to make async actions with createAsyncThunk for file uploads
export const apiCallHelperUpload = async (
  url,
  method,
  formData,
  getState,
  actionType
) => {
  try {
    const response = await axios({
      method,
      url: `${axiosInstance.defaults.baseURL}${url}`,
      data: formData,
      headers: {
        'x-auth-token': getState().auth.token,
        'Content-Type': 'multipart/form-data',
      },
    });
    if (
      (response?.status === 200 || response?.status === 201) &&
      reloadActionTypes.includes(actionType)
    ) {
      setTimeout(() => {
        window.location.reload();
      }, RELOAD_TIMEOUT);
    }

    return response?.data;
  } catch (error) {
    if (
      error?.response?.data &&
      error?.response?.data?.message &&
      !noToastActionTypes.includes(actionType)
    ) {
      notify(error?.response?.data?.message, 'error');
    }
    return Promise.reject(error?.response?.data?.message);
  }
};

export const handlePending = (state) => {
  state.isLoading = true;
};

export const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.error || 'An error occurred.';
};

window.addEventListener('beforeunload', () => {
  if (window.__TOAST_CONTROL__) {
    window.__TOAST_CONTROL__.success = false;
    window.__TOAST_CONTROL__.error = false;
    window.__TOAST_CONTROL__.retryNotified = false; // <-- important
  }
});
