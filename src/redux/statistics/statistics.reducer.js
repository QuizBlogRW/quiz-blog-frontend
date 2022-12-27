import { GET_50_NEW_USERS, GET_50_NEW_USERS_FAIL, NEW_50_USERS_LOADING, GET_ALL_USERS, GET_ALL_USERS_FAIL, ALL_USERS_LOADING, GET_USERS_WITH_IMAGE, GET_USERS_WITH_IMAGE_FAIL, USERS_WITH_IMAGE_LOADING, GET_USERS_WITH_SCHOOL, GET_USERS_WITH_SCHOOL_FAIL, GET_USERS_WITH_LEVEL, GET_USERS_WITH_LEVEL_FAIL, GET_USERS_WITH_FACULTY, GET_USERS_WITH_FACULTY_FAIL, GET_USERS_WITH_INTERESTS, GET_USERS_WITH_INTERESTS_FAIL, GET_USERS_WITH_ABOUT, GET_USERS_WITH_ABOUT_FAIL, GET_TOP_100_QUIZZING_USERS, GET_TOP_100_QUIZZING_USERS_FAIL, GET_TOP_100_DOWNLOADERS, GET_TOP_100_DOWNLOADERS_FAIL, GET_TOP_20_QUIZZES, GET_TOP_20_QUIZZES_FAIL, GET_QUIZZES_STATS, GET_QUIZZES_STATS_FAIL, GET_TOP_20_NOTES, GET_TOP_20_NOTES_FAIL, GET_NOTES_STATS, GET_NOTES_STATS_FAIL, USERS_WITH_SCHOOL_LOADING, USERS_WITH_LEVEL_LOADING, USERS_WITH_FACULTY_LOADING, USERS_WITH_INTERESTS_LOADING, USERS_WITH_ABOUT_LOADING, TOP_100_QUIZZING_USERS_LOADING, TOP_100_DOWNLOADERS_LOADING, TOP_20_QUIZZES_LOADING, QUIZZES_STATS_LOADING, TOP_20_NOTES_LOADING, NOTES_STATS_LOADING, GET_QUIZ_CATEGORIES_STATS, GET_QUIZ_CATEGORIES_STATS_FAIL, QUIZ_CATEGORIES_STATS_LOADING, GET_NOTE_CATEGORIES_STATS, GET_NOTE_CATEGORIES_STATS_FAIL, NOTE_CATEGORIES_STATS_LOADING } from './statistics.types'


const INITIAL_STATE = {
  new50Users: [],
  is50newUsersLoading: true,

  allUsers: [],
  isAllUsersLoading: true,

  usersWithImage: [],
  isUsersWithImageLoading: true,

  usersWithSchool: [],
  isUsersWithSchoolLoading: true,

  usersWithLevel: [],
  isUsersWithLevelLoading: true,

  usersWithFaculty: [],
  isUsersWithFacultyLoading: true,

  usersWithInterests: [],
  isUsersWithInterestsLoading: true,

  usersWithAbout: [],
  isUsersWithAboutLoading: true,

  top100Quizzing: [],
  isTop100QuizzingLoading: true,

  top100Downloaders: [],
  isTop100DownloadersLoading: true,

  top20Quizzes: [],
  isTop20QuizzesLoading: true,

  quizzesStats: [],
  isQuizzesStatsLoading: true,

  top20Notes: [],
  isTop20NotesLoading: true,

  notesStats: [],
  isNotesStatsLoading: true,

  quizCategoriesStats: [],
  isQuizCategoriesStatsLoading: true,

  notesCategoriesStats: [],
  isNotesCategoriesStatsLoading: true,

  msg: null
}

const statisticsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

      // GETTERS
    case GET_50_NEW_USERS:
      return {
        ...state,
        is50newUsersLoading: false,
        new50Users: action.payload
      }

    case GET_ALL_USERS:
      return {
        ...state,
        isAllUsersLoading: false,
        allUsers: action.payload
      }

    case GET_USERS_WITH_IMAGE:
      return {
        ...state,
        isUsersWithImageLoading: false,
        usersWithImage: action.payload
      }

    case GET_USERS_WITH_SCHOOL:
      return {
        ...state,
        isUsersWithSchoolLoading: false,
        usersWithSchool: action.payload
      }

    case GET_USERS_WITH_LEVEL:
      return {
        ...state,
        isUsersWithLevelLoading: false,
        usersWithLevel: action.payload
      }

    case GET_USERS_WITH_FACULTY:
      return {
        ...state,
        isUsersWithFacultyLoading: false,
        usersWithFaculty: action.payload
      }

    case GET_USERS_WITH_INTERESTS:
      return {
        ...state,
        isUsersWithInterestsLoading: false,
        usersWithInterests: action.payload
      }

    case GET_USERS_WITH_ABOUT:
      return {
        ...state,
        isUsersWithAboutLoading: false,
        usersWithAbout: action.payload
      }

    case GET_TOP_100_QUIZZING_USERS:
      return {
        ...state,
        isTop100QuizzingLoading: false,
        top100Quizzing: action.payload
      }

    case GET_TOP_100_DOWNLOADERS:
      return {
        ...state,
        isTop100DownloadersLoading: false,
        top100Downloaders: action.payload
      }

    case GET_TOP_20_QUIZZES:
      return {
        ...state,
        isTop20QuizzesLoading: false,
        top20Quizzes: action.payload
      }

    case GET_QUIZZES_STATS:
      return {
        ...state,
        isQuizzesStatsLoading: false,
        quizzesStats: action.payload
      }

    case GET_TOP_20_NOTES:
      return {
        ...state,
        isTop20NotesLoading: false,
        top20Notes: action.payload
      }

    case GET_NOTES_STATS:
      return {
        ...state,
        isNotesStatsLoading: false,
        notesStats: action.payload
      }

    case GET_QUIZ_CATEGORIES_STATS:
      return {
        ...state,
        isQuizCategoriesStatsLoading: false,
        quizCategoriesStats: action.payload
      }

    case GET_NOTE_CATEGORIES_STATS:
      return {
        ...state,
        isNotesCategoriesStatsLoading: false,
        notesCategoriesStats: action.payload
      }


    // LOADING
    case NEW_50_USERS_LOADING:
      return {
        ...state,
        is50newUsersLoading: true
      }

    case ALL_USERS_LOADING:
      return {
        ...state,
        isAllUsersLoading: true
      }

    case USERS_WITH_IMAGE_LOADING:
      return {
        ...state,
        isUsersWithImageLoading: true
      }

    case USERS_WITH_SCHOOL_LOADING:
      return {
        ...state,
        isUsersWithSchoolLoading: true
      }

    case USERS_WITH_LEVEL_LOADING:
      return {
        ...state,
        isUsersWithLevelLoading: true
      }

    case USERS_WITH_FACULTY_LOADING:
      return {
        ...state,
        isUsersWithFacultyLoading: true
      }

    case USERS_WITH_INTERESTS_LOADING:
      return {
        ...state,
        isUsersWithInterestsLoading: true
      }

    case USERS_WITH_ABOUT_LOADING:
      return {
        ...state,
        isUsersWithAboutLoading: true
      }

    case TOP_100_QUIZZING_USERS_LOADING:
      return {
        ...state,
        isTop100QuizzingLoading: true
      }

    case TOP_100_DOWNLOADERS_LOADING:
      return {
        ...state,
        isTop100DownloadersLoading: true
      }

    case TOP_20_QUIZZES_LOADING:
      return {
        ...state,
        isTop20QuizzesLoading: true
      }

    case QUIZZES_STATS_LOADING:
      return {
        ...state,
        isQuizzesStatsLoading: true
      }

    case TOP_20_NOTES_LOADING:
      return {
        ...state,
        isTop20NotesLoading: true
      }

    case NOTES_STATS_LOADING:
      return {
        ...state,
        isNotesStatsLoading: true
      }

    case QUIZ_CATEGORIES_STATS_LOADING:
      return {
        ...state,
        isQuizCategoriesStatsLoading: true
      }

    case NOTE_CATEGORIES_STATS_LOADING:
      return {
        ...state,
        isNotesCategoriesStatsLoading: true
      }


    
    // WHEN FAILED
    case GET_50_NEW_USERS_FAIL:
    case GET_ALL_USERS_FAIL:
    case GET_USERS_WITH_IMAGE_FAIL:
    case GET_USERS_WITH_SCHOOL_FAIL:
    case GET_USERS_WITH_LEVEL_FAIL:
    case GET_USERS_WITH_FACULTY_FAIL:
    case GET_USERS_WITH_INTERESTS_FAIL:
    case GET_USERS_WITH_ABOUT_FAIL:
    case GET_TOP_100_QUIZZING_USERS_FAIL:
    case GET_TOP_100_DOWNLOADERS_FAIL:
    case GET_TOP_20_QUIZZES_FAIL:
    case GET_QUIZZES_STATS_FAIL:
    case GET_TOP_20_NOTES_FAIL:
    case GET_NOTES_STATS_FAIL:
    case GET_QUIZ_CATEGORIES_STATS_FAIL:
    case GET_NOTE_CATEGORIES_STATS_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    default:
      return state
  }
}

export default statisticsReducer