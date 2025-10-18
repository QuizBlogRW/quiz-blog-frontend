import axios from 'axios'
import { notify } from '@/utils/notifyToast'

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
export const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Content-Type': 'application/json',
    }
})

// Add request interceptor for debugging
if (import.meta.env.VITE_DEBUG === 'true') {
    axiosInstance.interceptors.request.use(request => {
        return request;
    });

    // Log responses
    axiosInstance.interceptors.response.use(
        response => {
            console.log('✅ API Response:', response.status, response.config?.url);
            return response;
        },
        error => {
            if (!error.response?.status) {
                console.error('❌ API Error:', error);
            }
            console.error('❌ API Error:', error.response?.status, error.config?.url);
            return Promise.reject(error?.response);
        }
    );
}

// List of action types that doesn't require a reload
const reloadActionTypes = ['verify', 'login']
const noToastActionTypes = ['loadUser', 'createBlogPostView']

// Default reload timeout
const RELOAD_TIMEOUT = 2000

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
                    notify(response.data?.error ? response.data.error : response.data?.msg ? response.data.msg : 'Success', 'success')
                }
            }
        }

        return response?.data
    } catch (error) {

        // err might be a string from the axios interceptor or an error object
        let errorMessage = 'An error occurred'

        if (typeof error === 'string') {

            // This is the processed error message from axios interceptor
            errorMessage = error
        } else if (error && error.data) {

            // Handle structured errors
            if (error.data.message) {

                errorMessage = error.data.message
                if (!noToastActionTypes.includes(actionType)) {
                    notify(errorMessage, 'error')
                }
            }
            else {
                errorMessage = 'An error with data occurred'
                // console.log(`\n\n${errorMessage}:\n${error.data}`)
            }

            if (error.data.id == 'CONFIRM_ERR') {
                throw new Error('CONFIRM_ERR')
            }
        } else {
            // Fallback to error message
            errorMessage = 'An error occurred'
            // console.log(`\n\n${errorMessage}:\n${error}`)
        }

        // Throw the correct error message
        throw new Error(errorMessage)
    }
}

// API call helper function to make async actions with createAsyncThunk for file uploads
// TODO: Add error handling as done in apiCallHelper
export const apiCallHelperUpload = async (url, method, formData, getState, actionType) => {
    try {
        const response = await axiosInstance[method](url, formData, {
            headers: { 'x-auth-token': getState().auth.token },
        })

        if ((response.status === 200 || response.status === 201) && reloadActionTypes.includes(actionType)) {
            setTimeout(() => { window.location.reload() }, RELOAD_TIMEOUT)
        }

        return response?.data
    } catch (error) {
        if (error.response && error.response.data && error.response.data.error && !noToastActionTypes.includes(actionType)) {
            notify(error.response?.data?.error, 'error')
        }
        return Promise.reject(error.response?.data?.error)
    }
}


export const handlePending = (state) => {
    state.isLoading = true;
};

export const handleRejected = (state, action) => {
    state.isLoading = false;
    state.error = action.error || `An error occurred.`;

    // Log error for debugging
    // console.error(`API call failed for action type: ${action.type}`, action?.error?.message || action.error);
};
