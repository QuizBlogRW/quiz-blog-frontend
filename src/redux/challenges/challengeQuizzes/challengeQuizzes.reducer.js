import { GET_CHALLENGE_QUIZES, GET_ONE_CHALLENGE_QUIZ, GET_ONE_CHALLENGE_QUIZ_FAIL, GET_CATEGORY_CHALLENGE_QUIZES, GET_CATEGORY_CHALLENGE_QUIZES_FAIL, CREATE_CHALLENGE_QUIZ, CREATE_CHALLENGE_QUIZ_FAIL, DELETE_CHALLENGE_QUIZ, DELETE_CHALLENGE_QUIZ_FAIL, UPDATE_CHALLENGE_QUIZ, UPDATE_CHALLENGE_QUIZ_FAIL, CHALLENGE_QUIZES_LOADING, GET_ALL_CHALLENGE_QUIZES, ALL_CHALLENGE_QUIZES_LOADING, GET_NOTES_CHALLENGE_QUIZES, GET_NOTES_CHALLENGE_QUIZES_FAIL } from "./challengeQuizzes.types";

const INITIAL_STATE = {
  allChQuizzes: [],
  allChQuizzesNoLimit: [],
  categoryQuizes: [],
  notesQuizes: [],
  oneChQuiz: '',
  isLoading: true,
  isNoLimitLoading: true,
};

const challengeQuizesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_CHALLENGE_QUIZES:
      return {
        ...state,
        isLoading: false,
        allChQuizzes: action.payload
      };

    case GET_ALL_CHALLENGE_QUIZES:
      return {
        ...state,
        isNoLimitLoading: false,
        allChQuizzesNoLimit: action.payload
      };

    case GET_ONE_CHALLENGE_QUIZ:
      return {
        ...state,
        isLoading: false,
        oneChQuiz: action.payload
      };

    case GET_CATEGORY_CHALLENGE_QUIZES:
      return {
        ...state,
        isLoading: false,
        categoryQuizes: action.payload
      };

    case GET_NOTES_CHALLENGE_QUIZES:
      return {
        ...state,
        isLoading: false,
        notesQuizes: action.payload
      };

    case CREATE_CHALLENGE_QUIZ:
      return {
        ...state,
        allChQuizzes: [...state.allChQuizzes, action.payload]
      };

    case CREATE_CHALLENGE_QUIZ_FAIL:
    case DELETE_CHALLENGE_QUIZ_FAIL:
    case UPDATE_CHALLENGE_QUIZ_FAIL:
    case GET_ONE_CHALLENGE_QUIZ_FAIL:
    case GET_CATEGORY_CHALLENGE_QUIZES_FAIL:
    case GET_NOTES_CHALLENGE_QUIZES_FAIL:
      return {
        ...state,
        msg: "Failed!"
      };

    case UPDATE_CHALLENGE_QUIZ:
      return {
        ...state,
        allChQuizzes: state.allChQuizzes.map((quiz) => {

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

    case DELETE_CHALLENGE_QUIZ:
      return {
        ...state,
        allChQuizzes: state.allChQuizzes.filter(quiz => quiz._id !== action.payload)
      }

    case CHALLENGE_QUIZES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case ALL_CHALLENGE_QUIZES_LOADING:
      return {
        ...state,
        isNoLimitLoading: true
      }

    default:
      return state;
  }
};

export default challengeQuizesReducer;