import axios from 'axios'
import { returnErrors } from './slices/errorSlice'
import { returnSuccess } from './slices/successSlice'

export const qbURL = 'https://myqb-245fdbd30c9b.herokuapp.com/'
export const qbTestURL = 'https://qb-test-c6396eeaa356.herokuapp.com/'
export const apiURL = 'https://quiz-blog-rw-server.onrender.com/'
export const devApiURL = 'http://localhost:4000/'

// Axios instance
const axiosInstance = axios.create({
    // baseURL: process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL),
    baseURL: qbTestURL,
})

// Function to format action type
const formatActionType = (actionType) => {
    const splittedWords = actionType.match(/[A-Z]?[a-z]+/g);

    // Lowercase all words
    splittedWords.forEach((word, index) => { splittedWords[index] = word.toLowerCase() });

    // First letter of first word to uppercase
    splittedWords[0] = splittedWords[0].charAt(0).toUpperCase() + splittedWords[0].slice(1);

    // Join all words to form a sentence without commas
    return splittedWords.join(' ');
};

// List of action types that doesn't require a reload
const noReloadActionTypes = ['saveFeedback', 'createComment', 'updateComment', 'deleteComment', 'replyContact', 'createBlogPostView', 'getCreateRoom', 'sendRoomMessage']

// API call helper function to make async actions with createAsyncThunk
export const apiCallHelper = async (url, method, body, getState, dispatch, actionType) => {

    const formattedActionType = formatActionType(actionType);

    try {

        if (method === 'get' || method === 'delete') {
            const response = await axiosInstance[method](url, { headers: { 'Content-Type': 'application/json', 'x-auth-token': getState().auth.token } })
            dispatch(returnSuccess({ msg: `${formattedActionType} success!`, status: response.status, id: actionType }))

            // reload the page after deleting successfully
            if (method === 'delete' && response.status === 200 && (!noReloadActionTypes.includes(actionType))) {
                setTimeout(() => { window.location.reload() }, 3000)
            }

            return response.data
        }
        else {
            const response = await axiosInstance[method](url, body, { headers: { 'Content-Type': 'application/json', 'x-auth-token': getState().auth.token } })
            dispatch(returnSuccess({ msg: `${formattedActionType} success!`, status: response.status, id: actionType }))

            // reload the page after creating or updating successfully
            if ((response.status === 200 || response.status === 201) && (!noReloadActionTypes.includes(actionType))) {
                setTimeout(() => { window.location.reload() }, 3000)
            }
            return response.data
        }

    } catch (err) {
        console.log(err.response.data)
        dispatch(returnErrors({ msg: err.response.data, status: err.response.status, id: actionType }))
        return Promise.reject(err.response.data)
    }
};


// API call helper function to make async actions with createAsyncThunk for file uploads
export const apiCallHelperUpload = async (url, method, formData, getState, dispatch, actionType) => {
    const formattedActionType = formatActionType(actionType);
    try {
        const response = await axiosInstance[method](url, formData, {
            headers: { 'x-auth-token': getState().auth.token },
        })

        dispatch(returnSuccess({ msg: `${formattedActionType} success!`, status: response.status, id: actionType }))

        // reload the page after creating or updating successfully
        if (response.status === 200 || response.status === 201) {
            setTimeout(() => { window.location.reload() }, 3000)
        }
        return response.data

    } catch (err) {
        console.log(err.response.data)
        dispatch(returnErrors({ msg: err.response.data, status: err.response.status, id: actionType }))
        return Promise.reject(err.response.data)
    }
}
