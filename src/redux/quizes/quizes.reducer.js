import { SET_QUIZES, GET_ONE_QUIZ, GET_ONE_QUIZ_FAIL, GET_CATEGORY_QUIZES, GET_CATEGORY_QUIZES_FAIL, CREATE_QUIZ, CREATE_QUIZ_FAIL, DELETE_QUIZ, DELETE_QUIZ_FAIL, UPDATE_QUIZ, UPDATE_QUIZ_FAIL, QUIZES_LOADING, NOTIFY_USERS, NOTIFY_USERS_FAIL, SET_ALL_QUIZES, ALL_QUIZES_LOADING, ADD_VIDEO_LINK, ADD_VIDEO_LINK_FAIL, DELETE_VIDEO, DELETE_VIDEO_FAIL, GET_NOTES_QUIZES, GET_NOTES_QUIZES_FAIL, GET_PAGINATED_QUIZES, GET_PAGINATED_QUIZES_FAIL } from "./quizes.types";

const INITIAL_STATE = {
  allQuizes: [],
  categoryQuizes: [],
  notesQuizes: [],
  oneQuiz: '',
  isLoading: true,

  allQuizesNoLimit: [],
  isNoLimitLoading: true,

  paginatedQuizes: [],
  totalPages: 0,
};

const quizesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_QUIZES:
      return {
        ...state,
        isLoading: false,
        allQuizes: action.payload
      };

    case GET_PAGINATED_QUIZES:
      return {
        ...state,
        isLoading: false,
        paginatedQuizes: action.payload.quizes,
        totalPages: action.payload.totalPages,
      }

    case SET_ALL_QUIZES:
      return {
        ...state,
        isNoLimitLoading: false,
        allQuizesNoLimit: action.payload
      };

    case GET_ONE_QUIZ:
      return {
        ...state,
        isLoading: false,
        oneQuiz: action.payload
      };

    case GET_CATEGORY_QUIZES:
      return {
        ...state,
        isLoading: false,
        categoryQuizes: action.payload
      };

    case GET_NOTES_QUIZES:
      return {
        ...state,
        isLoading: false,
        notesQuizes: action.payload
      };

    case CREATE_QUIZ:
      return {
        ...state,
        allQuizes: [...state.allQuizes, action.payload]
      };

    case NOTIFY_USERS:
      return {
        ...state,
        newQuizInfo: action.payload
      };

    case CREATE_QUIZ_FAIL:
    case DELETE_QUIZ_FAIL:
    case UPDATE_QUIZ_FAIL:
    case NOTIFY_USERS_FAIL:
    case GET_ONE_QUIZ_FAIL:
    case GET_CATEGORY_QUIZES_FAIL:
    case ADD_VIDEO_LINK_FAIL:
    case DELETE_VIDEO_FAIL:
    case GET_NOTES_QUIZES_FAIL:
    case GET_PAGINATED_QUIZES_FAIL:
      return {
        ...state,
        msg: "Failed!"
      };

    case ADD_VIDEO_LINK:
      return {
        ...state,
        allQuizes: state.allQuizes.map((quiz) => {

          if (quiz._id === action.payload.quizID) {

            return {
              ...quiz,
              video_links: [...quiz.video_links, action.payload]
            }

          } else return quiz;
        })
      }

    case UPDATE_QUIZ:
      return {
        ...state,
        allQuizes: state.allQuizes.map((quiz) => {

          if (quiz._id === action.payload.quizID) {

            return {
              ...quiz,
              title: action.payload.title,
              description: action.payload.description,
              last_updated_by: action.payload.last_updated_by,
              category: action.payload.category,
              oldCategoryID: action.payload.oldCategoryID
            }

          } else return quiz;
        })
      }

    case DELETE_VIDEO:
      return {
        ...state,
        allQuizes: state.allQuizes.map((quiz) => {

          if (quiz._id === action.payload.iD) {

            return {
              ...quiz,
              video_links: quiz.video_links.filter(vidlink => vidlink._id !== action.payload.vId)
            }
          } else return quiz;
        })
      }

    case DELETE_QUIZ:
      return {
        ...state,
        allQuizes: state.allQuizes.filter(quiz => quiz._id !== action.payload)
      }

    case QUIZES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case ALL_QUIZES_LOADING:
      return {
        ...state,
        isNoLimitLoading: true
      }

    default:
      return state;
  }
};

export default quizesReducer;