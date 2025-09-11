import axios from 'axios'
import { notify } from '../utils/notifyToast'

// Environment-based URLs
export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/'
export const qbTestURL = 'https://qb-test-c6396eeaa356.herokuapp.com/'
export const qbApiGateway = 'https://qb-api-gateway-faaa805537e5.herokuapp.com/'
export const apiURL = 'https://quiz-blog-rw-server.onrender.com/'
export const devApiURL = 'http://localhost:5000/'

// Use environment variables if available, fallback to hardcoded URLs
const getApiUrl = () => {
    if (import.meta.env.VITE_API_URL) {
        console.log('🔧 Using VITE_API_URL:', import.meta.env.VITE_API_URL);
        return import.meta.env.VITE_API_URL;
    }
    if (import.meta.env.VITE_API_GATEWAY_URL) {
        console.log('🔧 Using VITE_API_GATEWAY_URL:', import.meta.env.VITE_API_GATEWAY_URL);
        return import.meta.env.VITE_API_GATEWAY_URL;
    }
    const fallbackUrl = import.meta.env.MODE === 'development' ? devApiURL : (qbApiGateway || qbURL);
    console.log('🔧 Using fallback URL:', fallbackUrl);
    return fallbackUrl;
};

// Axios instance
const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    }
})

// Log the API URL being used
console.log('📡 Axios configured with baseURL:', axiosInstance.defaults.baseURL);

// Add request interceptor for debugging
if (import.meta.env.VITE_DEBUG === 'true') {
    axiosInstance.interceptors.request.use(request => {
        console.log('🚀 API Request:', request.method?.toUpperCase(), request.url, request?.data);
        return request;
    });
    
    axiosInstance.interceptors.response.use(
        response => {
            console.log('✅ API Response:', response.status, response.config?.url);
            return response;
        },
        error => {
            console.error('❌ API Error:', error.response?.status, error.config?.url, error?.response?.data?.message || error.message);
            return Promise.reject(error?.response?.data?.message || error.message);
        }
    );
}

// List of action types that doesn't require a reload
const reloadActionTypes = ['verify', 'login', 'changeStatus']
const noToastActionTypes = ['loadUser', 'createBlogPostView']

// Default reload timeout
const RELOAD_TIMEOUT = 4000

// API call helper function to make async actions with createAsyncThunk
export const apiCallHelper = async (url, method, body, getState, actionType) => {
    try {
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': getState().auth.token }
        const response = method === 'get' || method === 'delete' 
            ? await axiosInstance[method](url, { headers })
            : await axiosInstance[method](url, body, { headers })

        if ((response.status === 200 || response.status === 201) && method !== 'get') {

            if (reloadActionTypes.includes(actionType)) {
                setTimeout(() => { window.location.reload() }, RELOAD_TIMEOUT)
            }
            else {
                if (!noToastActionTypes.includes(actionType)) {
                    notify(response.data?.error ? response.data.error : response.data?.msg ? response.data.msg : '✅ Success', 'success')
                }
            }
        }

        return response?.data
    } catch (err) {
        // err might be a string from the axios interceptor or an error object
        let errorMessage = 'An error occurred'
        
        if (typeof err === 'string') {
            // This is the processed error message from axios interceptor
            errorMessage = err
        } else if (err.response && err.response.data) {
            // Handle structured error responses
            errorMessage = err.response.data.error || err.response.data.message || err.message || 'An error occurred'
            
            if (err.response.data.error && !noToastActionTypes.includes(actionType)) {
                console.log(err.response.data)
                notify(err.response.data.error, 'error')
                if (err.response.data.id == 'CONFIRM_ERR') {
                    throw new Error('CONFIRM_ERR')
                }
            }
        } else {
            // Fallback to error message
            errorMessage = err.message || 'An error occurred'
        }
        
        // Throw the correct error message
        throw new Error(errorMessage)
    }
}

// API call helper function to make async actions with createAsyncThunk for file uploads
export const apiCallHelperUpload = async (url, method, formData, getState, actionType) => {
    try {
        const response = await axiosInstance[method](url, formData, {
            headers: { 'x-auth-token': getState().auth.token },
        })

        if ((response.status === 200 || response.status === 201) && reloadActionTypes.includes(actionType)) {
            setTimeout(() => { window.location.reload() }, RELOAD_TIMEOUT)
        }

        return response?.data
    } catch (err) {
        if (err.response && err.response.data && err.response.data.error && !noToastActionTypes.includes(actionType)) {
            notify(err.response?.data?.error, 'error')
        }
        return Promise.reject(err.response?.data?.error)
    }
}


export const handlePending = (state) => {
    state.isLoading = true;
};

export const handleRejected = (state, action) => {
    state.isLoading = false;
    state.error = action.error?.message || 'An error occurred';
    
    // Log error for debugging
    console.error('API call failed:', action.error?.message || action.error);
};
