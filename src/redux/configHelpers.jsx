import axios from 'axios'
import { notify } from '../utils/notifyToast'

export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/'
export const qbTestURL = 'https://qb-test-c6396eeaa356.herokuapp.com/'
export const apiURL = 'https://quiz-blog-rw-server.onrender.com/'
export const devApiURL = 'http://localhost:4000/'

// Axios instance
const axiosInstance = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? devApiURL : qbURL,
    baseURL : qbTestURL,
})

// List of action types that doesn't require a reload
const reloadActionTypes = ['verify']
const noToastActionTypes = ['loadUser']

// Default reload timeout
const RELOAD_TIMEOUT = 3000

// API call helper function to make async actions with createAsyncThunk
export const apiCallHelper = async (url, method, body, getState, actionType) => {
    try {
        const headers = { 'Content-Type': 'application/json', 'x-auth-token': getState().auth.token }
        const response = await axiosInstance[method](url, method === 'get' || method === 'delete' ? { headers } : body, { headers })

        if ((response.status === 200 || response.status === 201) && reloadActionTypes.includes(actionType)) {
            setTimeout(() => { window.location.reload() }, RELOAD_TIMEOUT)
        }

        return response.data
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg && err.response.data.id !== 'NO_TOKEN' && !noToastActionTypes.includes(actionType)) {
            notify(err.response.data.msg, 'error')
        }
        return Promise.reject(err.response)
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

        return response.data
    } catch (err) {
        if (err.response && err.response.data && err.response.data.msg && err.response.data.id !== 'NO_TOKEN' && !noToastActionTypes.includes(actionType)) {
            notify(err.response.data.msg, 'error')
        }
        return Promise.reject(err.response)
    }
}
