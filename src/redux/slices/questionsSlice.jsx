import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getQuestions = createAsyncThunk("questions/getQuestions", async (_, { getState, dispatch }) =>
    apiCallHelper('/api/questions', 'get', null, getState, dispatch, 'getQuestions'))

export const getOneQuestion = createAsyncThunk("questions/getOneQuestion", async (questionId, { getState, dispatch }) =>
    apiCallHelper(`/api/questions/${questionId}`, 'get', null, getState, dispatch, 'getOneQuestion'))

export const addQuestion = createAsyncThunk("questions/addQuestion", async (formData, { getState, dispatch }) => 
    apiCallHelperUpload('/api/questions', 'post', formData, getState, dispatch, 'addQuestion'))

export const updateQuestion = createAsyncThunk("questions/updateQuestion", async ({ updatedQuestion, onUploadProgress }, { getState, dispatch }) =>
    apiCallHelperUpload(`/api/questions/${updatedQuestion.id}`, 'put', updatedQuestion, getState, dispatch, 'updateQuestion', onUploadProgress))

export const deleteQuestion = createAsyncThunk("questions/deleteQuestion", async (questionId, { getState, dispatch }) =>
    apiCallHelper(`/api/questions/${questionId}`, 'delete', null, getState, dispatch, 'deleteQuestion'))

// Questions slice
const initialState = {
    questionsData: [],
    oneQuestion: '',
    isLoading: false
}

const questionsSlice = createSlice({
    name: 'questions',
    initialState,
    reducers: {
        clearQuestions: state => {
            state.questionsData = []
            state.oneQuestion = ''
            state.isLoading = false
        }
    },
    extraReducers: (builder) => {

        // Fullfilled actions
        builder.addCase(getQuestions.fulfilled, (state, action) => {
            state.questionsData = action.payload
            state.isLoading = false
        })
        builder.addCase(getOneQuestion.fulfilled, (state, action) => {
            state.oneQuestion = action.payload
            state.isLoading = false
        })
        builder.addCase(addQuestion.fulfilled, (state, action) => {
            state.questionsData.push(action.payload)
            state.isLoading = false
        })
        builder.addCase(updateQuestion.fulfilled, (state, action) => {
            state.questionsData = state.questionsData.map(question => question._id === action.payload._id ? action.payload : question)
            state.isLoading = false
        })
        builder.addCase(deleteQuestion.fulfilled, (state, action) => {
            state.questionsData = state.questionsData.filter(question => question._id !== action.payload)
            state.isLoading = false
        })

        // Pending actions
        builder.addCase(getQuestions.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(getOneQuestion.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(addQuestion.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(updateQuestion.pending, (state, action) => {
            state.isLoading = true
        })
        builder.addCase(deleteQuestion.pending, (state, action) => {
            state.isLoading = true
        })

        // Rejected actions
        builder.addCase(getQuestions.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(getOneQuestion.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(addQuestion.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(updateQuestion.rejected, (state, action) => {
            state.isLoading = false
        })
        builder.addCase(deleteQuestion.rejected, (state, action) => {
            state.isLoading = false
        })

    }
})

export const { clearQuestions } = questionsSlice.actions
export default questionsSlice.reducer