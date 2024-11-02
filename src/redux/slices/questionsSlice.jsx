import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getQuestions = createAsyncThunk("questions/getQuestions", async (_, { getState }) =>
    apiCallHelper('/api/questions', 'get', null, getState, 'getQuestions'))

export const getOneQuestion = createAsyncThunk("questions/getOneQuestion", async (questionID, { getState }) =>
    apiCallHelper(`/api/questions/${questionID}`, 'get', null, getState, 'getOneQuestion'))

export const addQuestion = createAsyncThunk("questions/addQuestion", async (formData, { getState }) =>
    apiCallHelperUpload('/api/questions', 'post', formData, getState, 'addQuestion'))

export const updateQuestion = createAsyncThunk("questions/updateQuestion", async ({ questionID, formData }, { getState }) =>
    apiCallHelperUpload(`/api/questions/${questionID}`, 'put', formData, getState, 'updateQuestion'))

export const deleteQuestion = createAsyncThunk("questions/deleteQuestion", async (questionID, { getState }) =>
    apiCallHelper(`/api/questions/${questionID}`, 'delete', null, getState, 'deleteQuestion'))

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
        builder.addMatcher(
            (action) => [getQuestions.pending, getOneQuestion.pending, addQuestion.pending, updateQuestion.pending, deleteQuestion.pending].includes(action.type),
            (state) => {
                state.isLoading = true
            })

        // Rejected actions
        builder.addMatcher(
            (action) => [getQuestions.rejected, getOneQuestion.rejected, addQuestion.rejected, updateQuestion.rejected, deleteQuestion.rejected].includes(action.type),
            (state) => {
                state.isLoading = false
            })

    }
})

export const { clearQuestions } = questionsSlice.actions
export default questionsSlice.reducer