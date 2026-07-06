import axios from 'axios';
import { notify } from '@/utils/notifyToast';

// Global Toast Control (Singleton)
const initToastControl = () => {
  if (!window.__TOAST_CONTROL__) {
    window.__TOAST_CONTROL__ = {
      success: false,
      error: false,
      retryNotified: false,
      lastErrorTime: 0,
      errorCooldown: 3000, // Prevent duplicate errors within 3s
    };
  }
  return window.__TOAST_CONTROL__;
};

const toastControl = initToastControl();

// Backend URLs Configuration
export const BACKEND_URLS = {
  production: 'https://new2025qb-27db9eb372f9.herokuapp.com',
  test: 'https://qb-backend-one.vercel.app',
  development: 'http://localhost:5000',
};

// Environment Detection & URL Selection
const getApiUrl = () => {
  // Priority 1: Explicit environment variable
  const envUrl = import.meta.env.VITE_BACKEND_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
  }

  // Priority 2: Mode-based fallback
  const mode = import.meta.env.MODE;
  const fallbackUrl = BACKEND_URLS[mode] || BACKEND_URLS.production;
  return fallbackUrl;
};

export const API_BASE_URL = getApiUrl();

// Check if backend is Vercel (affects retry logic)
const isVercelBackend = API_BASE_URL.includes('vercel.app');

// Axios Instance Configuration
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: isVercelBackend ? 25000 : 60000, // Vercel has 10s limit for hobby, 60s for pro
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Auto-attach token if available
    const token = localStorage.getItem('token');
    if (token && !config.headers['x-auth-token']) {
      config.headers['x-auth-token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {

    // Reset error toast control on successful request
    if (toastControl.error) {
      toastControl.error = false;
      toastControl.retryNotified = false;
    }

    return response;
  },
  (error) => {
    // Build standardized error object
    let errorData = {
      name: error.response?.data?.name || error.response?.statusText || 'Unknown Error',
      message: error.response?.data?.message || 'Unknown error occurred',
      status: error.response?.status || null,
      isNetworkError: !error.response && error.request,
    };
    if (error.response?.data?.code) errorData.code = error.response.data.code;
    if (error.response?.data?.email) errorData.email = error.response.data.email;

    return Promise.reject(errorData);
  }
);

// Retry Configuration
const RETRY_CONFIG = {
  maxRetries: isVercelBackend ? 2 : 3, // Fewer retries for Vercel (cold starts)
  retryDelay: isVercelBackend ? 3000 : 5000,
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  retryableErrorCodes: ['ERR_NETWORK', 'ECONNREFUSED', 'ECONNABORTED', 'ETIMEDOUT'],
};

// Error Notification Helper
const notifyError = (message, code) => {
  // Skip notifications for specific error codes
  const skipCodes = ['NO_TOKEN_LOAD_USER_ERROR', 'TOKEN_EXPIRED'];
  if (skipCodes.includes(code)) {
    return;
  }

  // Prevent duplicate notifications
  const now = Date.now();
  if (toastControl.error && (now - toastControl.lastErrorTime) < toastControl.errorCooldown) {
    return;
  }

  notify(message, 'error');
  toastControl.error = true;
  toastControl.lastErrorTime = now;
};

// Retry Logic Helper
const shouldRetry = (error, attempt, maxRetries) => {
  if (attempt >= maxRetries) return false;

  // Check if error is retryable
  const isRetryableCode = RETRY_CONFIG.retryableErrorCodes.includes(error.code);
  const isRetryableStatus = error.status && RETRY_CONFIG.retryableStatusCodes.includes(error.status);
  const isNetworkError = error.isNetworkError;

  return isRetryableCode || isRetryableStatus || isNetworkError;
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Main API Call Helper
export const apiCallHelper = async (
  url,
  method = 'get',
  body = null,
  getState = null,
  actionType = null,
  options = {}
) => {
  const {
    retries = RETRY_CONFIG.maxRetries,
    retryDelay = RETRY_CONFIG.retryDelay,
    skipNotification = false,
    customHeaders = {},
  } = options;

  // Get token from Redux state or localStorage
  const token = getState?.()?.auth?.token || localStorage.getItem('token');

  const config = {
    headers: {
      ...customHeaders,
      ...(token && { 'x-auth-token': token }),
    },
  };

  let attempt = 0;

  while (attempt <= retries) {
    try {
      let response;

      if (method === 'get' || method === 'delete') {
        response = await axiosInstance[method](url, config);
      } else {
        response = await axiosInstance[method](url, body, config);
      }

      // Reset retry notification flag on success
      toastControl.retryNotified = false;

      return response.data;

    } catch (error) {
      attempt++;

      const willRetry = shouldRetry(error, attempt, retries);

      // Handle retry notification
      if (willRetry) {
        if (!toastControl.retryNotified) {
          notify(
            `Retrying in ${retryDelay / 1000}s... (${attempt}/${retries})`,
            'error'
          );
          toastControl.retryNotified = true;
        }

        await wait(retryDelay);
        continue;
      }

      // Final error - no more retries
      if (!skipNotification) {
        notifyError(error.message, error.code);
      }

      let errorObject = {
        message: error.message,
        code: error.code,
        status: error.status,
        name: error.name,
      };
      if (error.email) errorObject.email = error.email;
      throw errorObject;
    }
  }
};

// File Upload Helper
export const apiCallHelperUpload = async (
  url,
  method = 'post',
  formData,
  getState = null,
  actionType = null,
  options = {}
) => {
  const {
    onUploadProgress = null,
    skipNotification = false,
  } = options;

  try {
    const token = getState?.()?.auth?.token || localStorage.getItem('token');

    const response = await axiosInstance.request({
      method,
      url,
      data: formData,
      headers: {
        'x-auth-token': token,
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
      ...(onUploadProgress && { onUploadProgress }),
    });

    return response.data;

  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Upload failed';

    if (!skipNotification) {
      notify(message, 'error');
    }

    throw {
      message,
      code: error.code,
      status: error.response?.status,
    };
  }
};

// Redux Async Thunk Helpers
export const handlePending = (state) => {
  state.isLoading = true;
  state.error = null;
};

export const handleFulfilled = (state) => {
  state.isLoading = false;
  state.error = null;
};

export const handleRejected = (state, action) => {
  state.isLoading = false;
  state.error = action.payload?.message || 'An error occurred';

  // If account is not verified (code: NOT_VERIFIED), go to verify page
  if (action.payload?.code === 'NOT_VERIFIED') {
    state.isAuthenticated = false;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.setItem('emailForOTP', action.payload?.email);
    setTimeout(() => (window.location.href = '/verify'), 3000);
    return;
  }
};

// Utility Functions
export const resetToastControl = () => {
  toastControl.success = false;
  toastControl.error = false;
  toastControl.retryNotified = false;
  toastControl.lastErrorTime = 0;
};

// Health Check Utility
export const checkBackendHealth = async () => {
  try {
    const response = await axiosInstance.get('/api/health', {
      timeout: 5000,
    });
    return {
      healthy: response.data.status === 'OK',
      data: response.data,
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message,
    };
  }
};

// Cleanup on Page Unload
window.addEventListener('beforeunload', resetToastControl);
