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
      console.error('❌ API Error Response:', error.response);
      // Build the error object with code, message, status
      const errorObject = {
        code: error.response?.data.code,
        name: error.response?.data.name,
        message: error.response?.data?.message || 'Unknown error',
        status: error.response?.status,
      };
      return Promise.reject(errorObject);
    }
  );
}

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
  console.log("getState().auth: ", getState().auth);
  const token = getState().auth.token || localStorage.getItem("token");

  const headers = {
    'x-auth-token': token,
    'Content-Type': 'application/json',
  };

  let attempt = 0;

  while (attempt <= retries) {
    try {
      const response =
        method === 'get' || method === 'delete'
          ? await axiosInstance[method](url, { headers })
          : await axiosInstance[method](url, body, { headers });

      return response.data;
    } catch (err) {
      console.log("err: ", err)
      const code = err?.response?.code || err?.code || 'UNKNOWN_ERROR';
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

      const message = err?.code !== "NO_TOKEN_LOAD_USER_ERROR" && (err?.message || 'Unknown error');

      // Only notify once globally per page load
      if (message && !window.__TOAST_CONTROL__.error) {
        notify(message, 'error');
        window.__TOAST_CONTROL__.error = true;
      }

      throw { message, code: err.code, status: err?.status };
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

    const token = getState().auth.token || localStorage.getItem("token");
    const response = await axios({
      method,
      url: `${axiosInstance.defaults.baseURL}${url}`,
      data: formData,
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json',
      },
    });

    return response?.data;
  } catch (error) {
    if (error?.response?.data && error?.response?.data?.message) {
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
    window.__TOAST_CONTROL__.retryNotified = false;
  }
});
