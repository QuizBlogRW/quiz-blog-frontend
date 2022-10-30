import { SET_QUESTIONS, GET_ONE_QUESTION, GET_ONE_QUESTION_FAIL, QUESTIONS_LOADING, ADD_QUESTION, UPDATE_QUESTION, DELETE_QUESTION, DELETE_QUESTION_FAIL, ADD_QUESTION_FAIL } from "./questions.types";

const INITIAL_STATE = {
  questionsData: [],
  oneQuestion: '',
  isLoading: true
};

const questionsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_QUESTIONS:
      return {
        ...state,
        isLoading: false,
        questionsData: action.payload
      };

    case GET_ONE_QUESTION:
      return {
        ...state,
        isLoading: false,
        oneQuestion: action.payload
      };

    case ADD_QUESTION:
      return {
        ...state,
        questionsData: [...state.questionsData, action.payload]
      };

    case ADD_QUESTION_FAIL:
    case GET_ONE_QUESTION_FAIL:
    case DELETE_QUESTION_FAIL:
      return {
        ...state,
        questionsData: null,
        oneQuestion: '',
        isLoading: false
      };

    case UPDATE_QUESTION:
      return {
        ...state,
        questionsData: state.questionsData.map((question) => {

          if (question._id === action.payload.qtId) {

            return {
              ...question,
              questionText: action.payload.questionText,
              question_image: action.payload.question_image,
              answerOptions: action.payload.answerOptions,
              quiz: action.payload.quiz,
              oldQuizID: action.payload.oldQuizID,
              last_updated_by: action.payload.last_updated_by,
              duration: action.payload.duration
            }

          } else return question;
        })
      }

    case DELETE_QUESTION:
      return {
        ...state,
        questionsData: state.questionsData.filter(question => question._id !== action.payload)
      }

    case QUESTIONS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default questionsReducer;