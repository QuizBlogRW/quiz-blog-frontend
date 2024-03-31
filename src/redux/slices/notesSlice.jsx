import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper, apiCallHelperUpload } from '../configHelpers'

// Async actions with createAsyncThunk
export const getNotes = createAsyncThunk("notes/getNotes", async (_, { getState, dispatch }) =>
  apiCallHelper('/api/notes', 'get', null, getState, dispatch, 'getNotes'))

export const getLandingDisplayNotes = createAsyncThunk("notes/getLandingDisplayNotes", async (limit, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/landingDisplay?limit=${limit ? limit : 10}`, 'get', null, getState, dispatch, 'getLandingDisplayNotes'))

export const getOneNotePaper = createAsyncThunk("notes/getOneNotePaper", async (noteSlug, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/${noteSlug}`, 'get', null, getState, dispatch, 'getOneNotePaper'))

export const getNotesByChapter = createAsyncThunk("notes/getNotesByChapter", async (chapterId, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/chapter/${chapterId}`, 'get', null, getState, dispatch, 'getNotesByChapter'))

export const getNotesByCCatg = createAsyncThunk("notes/getNotesByCCatg", async (ccatgID, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/ccatg/${ccatgID}`, 'get', null, getState, dispatch, 'getNotesByCCatg'))

export const createNotes = createAsyncThunk("notes/createNotes", async (newNotes, { getState, dispatch }) =>
  apiCallHelperUpload('/api/notes', 'post', newNotes, getState, dispatch, 'createNotes'))

export const updateNotes = createAsyncThunk("notes/updateNotes", async (updatedNotes, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/${updatedNotes.idToUpdate}`, 'put', updatedNotes, getState, dispatch, 'updateNotes'))

export const addNotesQuizes = createAsyncThunk("notes/addNotesQuizes", async (notesQuizzes, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/notes-quizzes/${notesQuizzes.noteID}`, 'put', notesQuizzes, getState, dispatch, 'addNotesQuizes'))

export const deleteNotes = createAsyncThunk("notes/deleteNotes", async (noteID, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/${noteID}`, 'delete', null, getState, dispatch, 'deleteNotes'))

export const removeQzNt = createAsyncThunk("notes/removeQzNt", async ({ noteID, quizID }, { getState, dispatch }) =>
  apiCallHelper(`/api/notes/notes-quizzes/remove/${noteID}`, 'put', { noteID, quizID }, getState, dispatch, 'removeQzNt'))

// Notes slice
const initialState = {
  isLoading: false,
  allNotes: [],
  limitedLandingDisplayNotes: [],
  oneNotePaper: {},
  notesByChapter: [],
  notesByCCatg: [],
  allDownloads: []
}

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    clearNotes: state => {
      state.isLoading = false
      state.allNotes = []
      state.limitedLandingDisplayNotes = []
      state.oneNotePaper = {}
      state.notesByChapter = []
      state.notesByCCatg = []
      state.allDownloads = []
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getNotes.fulfilled, (state, action) => {
      state.allNotes = action.payload
      state.isLoading = false
    })
    builder.addCase(getLandingDisplayNotes.fulfilled, (state, action) => {
      state.limitedLandingDisplayNotes = action.payload
      state.isLoading = false
    })
    builder.addCase(getOneNotePaper.fulfilled, (state, action) => {
      state.oneNotePaper = action.payload
      state.isLoading = false
    })
    builder.addCase(getNotesByChapter.fulfilled, (state, action) => {
      state.notesByChapter = action.payload
      state.isLoading = false
    })
    builder.addCase(getNotesByCCatg.fulfilled, (state, action) => {
      state.notesByCCatg = action.payload
      state.isLoading = false
    })
    builder.addCase(createNotes.fulfilled, (state, action) => {
      state.allNotes.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(updateNotes.fulfilled, (state, action) => {
      state.allNotes = state.allNotes.map(note => note._id === action.payload._id ? action.payload : note)
      state.isLoading = false
    })
    builder.addCase(addNotesQuizes.fulfilled, (state, action) => {
      state.allNotes = state.allNotes.map(note => note._id === action.payload._id ? action.payload : note)
      state.isLoading = false
    })
    builder.addCase(deleteNotes.fulfilled, (state, action) => {
      state.allNotes = state.allNotes.filter(note => note._id !== action.payload)
      state.isLoading = false
    })
    builder.addCase(removeQzNt.fulfilled, (state, action) => {
      state.allNotes = state.allNotes.map(note => note._id === action.payload._id ? action.payload : note)
      state.isLoading = false
    })

    // Pending actions
    builder.addCase(getNotes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getLandingDisplayNotes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getOneNotePaper.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getNotesByChapter.pending, state => {
      state.isLoading = true
    })
    builder.addCase(getNotesByCCatg.pending, state => {
      state.isLoading = true
    })
    builder.addCase(createNotes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(updateNotes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(addNotesQuizes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(deleteNotes.pending, state => {
      state.isLoading = true
    })
    builder.addCase(removeQzNt.pending, state => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getNotes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getLandingDisplayNotes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getOneNotePaper.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getNotesByChapter.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(getNotesByCCatg.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(createNotes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(updateNotes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(addNotesQuizes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(deleteNotes.rejected, state => {
      state.isLoading = false
    })
    builder.addCase(removeQzNt.rejected, state => {
      state.isLoading = false
    })
  }
})

export const { clearNotes } = notesSlice.actions
export default notesSlice.reducer