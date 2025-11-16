import axios from 'axios';
import { notify } from '@/utils/notifyToast';

// Environment-based URLs
export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/';
export const qbTestURL = 'https://qb-test-c6396eeaa356.herokuapp.com/';
export const apiURL = 'https://quiz-blog-rw-server.onrender.com/';
export const devApiURL = 'http://localhost:5000/';

// Use environment variables if available, fallback to hardcoded URLs
const getApiUrl = () => {
  if (import.meta.env.VITE_BACKEND_URL) {
    console.log('🔧 Using VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);
    return import.meta.env.VITE_BACKEND_URL;
  }
  const fallbackUrl =
    import.meta.env.MODE === 'development' ? devApiURL : qbURL;
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
        console.error('❌ API Error:', error);
      }
      console.error('❌ API Error:', error.response?.status, error.config?.url);
      return Promise.reject(error.response?.data || error.message || error);
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
  actionType
) => {
  const headers = {
    'x-auth-token': getState().auth.token,
    'Content-Type': 'application/json',
  };

  try {
    const response =
      method === 'get' || method === 'delete'
        ? await axiosInstance[method](url, { headers })
        : await axiosInstance[method](url, body, { headers });

    if (
      (response.status === 200 || response.status === 201) &&
      method !== 'get'
    ) {
      if (reloadActionTypes.includes(actionType)) {
        setTimeout(() => {
          window.location.reload();
        }, RELOAD_TIMEOUT);
      } else {
        if (!noToastActionTypes.includes(actionType)) {
          notify(
            response.data?.message
              ? response.data.message
              : `${method === 'post'
                ? 'Created'
                : method === 'put'
                  ? 'Updated'
                  : 'Deleted'
              } Successfully!`,
            'success'
          );
        }
      }
    }

    return response?.data;
  } catch (error) {
    // err might be a string from the axios interceptor or an error object
    let errorMessage = `An error occurred ${error?.message}`;
    console.log(error);

    if (typeof error === 'string') {
      // This is the processed error message from axios interceptor
      errorMessage = error;
    } else if (error?.response?.data) {

      // Handle structured errors
      if (error?.response?.data?.message) {
        errorMessage = error?.response?.data?.message;
        if (!noToastActionTypes.includes(actionType)) {
          notify(errorMessage, 'error');
        }
      }
    } else {
      // Fallback to error message
      errorMessage = `An error occurred: ${error.message}`;
    }
    throw { message: errorMessage, code: error.code, status: error.response?.status }
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
