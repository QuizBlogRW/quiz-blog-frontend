import {
  GET_NOTES, GET_NOTES_FAIL, GET_NOTES_BY_CHAPTER_FAIL, NOTES_BY_CHAPTER_LOADING, GET_NOTES_BY_CHAPTER, CREATE_NOTE, CREATE_NOTE_FAIL, DELETE_NOTE, DELETE_NOTE_FAIL, UPDATE_NOTE, UPDATE_NOTE_FAIL, NOTES_LOADING, GET_LANDING_DISPLAY_NOTES, GET_LANDING_DISPLAY_NOTES_FAIL, LANDING_DISPLAY_NOTES_LOADING, GET_ONE_NOTE_PAPER, GET_ONE_NOTE_PAPER_FAIL, GET_ONE_NOTE_PAPER_LOADING, GET_LANDING_DISPLAY_NO_LIMIT_NOTES, GET_LANDING_DISPLAY_NO_LIMIT_NOTES_FAIL, LANDING_DISPLAY_NOTES_NO_LIMIT_LOADING, GET_NOTES_BY_COURSE_CATEGORY_FAIL,
  GET_NOTES_BY_COURSE_CATEGORY, NOTES_BY_COURSE_CATEGORY_LOADING, ADD_NOTES_QUIZZES, ADD_NOTES_QUIZZES_FAIL, REMOVE_QUIZ_NOTES, REMOVE_QUIZ_NOTES_FAIL
} from './notes.types'

const INITIAL_STATE = {
  isLoading: true,
  allNotes: [],

  isLandingDisplayNotesLimitedLoading: true,
  allLandingDisplayNotesLimited: [],

  allLandingDisplayNotesNoLimitLoading: true,
  allLandingDisplayNotesNoLimit: [],

  isOneNotePaperLoading: true,
  oneNotePaper: {},

  notesByChapter: [],
  isByChapterLoading: true,

  notesByCCatg: [],
  isByCCatgLoading: true,

  allDownloads: [],
}

const notesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_NOTES:
      return {
        ...state,
        isLoading: false,
        allNotes: action.payload
      }

    case GET_LANDING_DISPLAY_NOTES:
      return {
        ...state,
        isLandingDisplayNotesLimitedLoading: false,
        allLandingDisplayNotesLimited: action.payload
      }

    case GET_LANDING_DISPLAY_NO_LIMIT_NOTES:
      return {
        ...state,
        allLandingDisplayNotesNoLimitLoading: false,
        allLandingDisplayNotesNoLimit: action.payload
      }

    case GET_ONE_NOTE_PAPER:
      return {
        ...state,
        isOneNotePaperLoading: false,
        oneNotePaper: action.payload
      }

    case GET_NOTES_BY_CHAPTER:
      return {
        ...state,
        isByChapterLoading: false,
        notesByChapter: action.payload
      }

    case GET_NOTES_BY_COURSE_CATEGORY:
      return {
        ...state,
        isByCCatgLoading: false,
        notesByCCatg: action.payload
      }

    case CREATE_NOTE:
      return {
        ...state,
        allNotes: [...state.allNotes, action.payload],
      }

    case CREATE_NOTE_FAIL:
    case DELETE_NOTE_FAIL:
    case UPDATE_NOTE_FAIL:
    case GET_NOTES_FAIL:
    case GET_NOTES_BY_CHAPTER_FAIL:
    case GET_LANDING_DISPLAY_NOTES_FAIL:
    case GET_ONE_NOTE_PAPER_FAIL:
    case GET_LANDING_DISPLAY_NO_LIMIT_NOTES_FAIL:
    case GET_NOTES_BY_COURSE_CATEGORY_FAIL:
    case ADD_NOTES_QUIZZES_FAIL:
    case REMOVE_QUIZ_NOTES_FAIL:
      return {
        ...state,
        msg: 'Failed!'
      }

    case UPDATE_NOTE:
      return {
        ...state,
        allNotes: state.allNotes.map((note) => {

          if (note._id === action.payload.idToUpdate) {

            return {
              ...note,
              title: action.payload.title,
              description: action.payload.description,
              notes_file: action.payload.notes_file
            }

          } else return note
        })
      }

    case ADD_NOTES_QUIZZES:
      return {
        ...state,
        allNotes: state.allNotes.map((note) => {

          if (note._id === action.payload.noteID) {

            return {
              ...note,
              quizzes: [...note.quizzes, action.payload.quizesState]
            }

          } else return note
        })
      }

    case DELETE_NOTE:
      return {
        ...state,
        allNotes: state.allNotes.filter(note => note._id !== action.payload)
      }

    case REMOVE_QUIZ_NOTES:
      return {
        ...state,
        allNotes: state.allNotes.map((note) => {

          if (note._id === action.payload.noteID) {

            return {
              ...note,
              quizzes: note.quizzes.filter(qz => qz._id !== action.payload.quizID)
            }

          } else return note
        })
      }

    case NOTES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case NOTES_BY_CHAPTER_LOADING:
      return {
        ...state,
        isByChapterLoading: true
      }

    case NOTES_BY_COURSE_CATEGORY_LOADING:
      return {
        ...state,
        isByCCatgLoading: true
      }

    case LANDING_DISPLAY_NOTES_LOADING:
      return {
        ...state,
        isLandingDisplayNotesLimitedLoading: true
      }

    case LANDING_DISPLAY_NOTES_NO_LIMIT_LOADING:
      return {
        ...state,
        allLandingDisplayNotesNoLimitLoading: true
      }

    case GET_ONE_NOTE_PAPER_LOADING:
      return {
        ...state,
        isOneNotePaperLoading: true
      }

    default:
      return state
  }
}

export default notesReducer