import { GET_CHALLENGE_QUESTIONS, GET_ONE_CHALLENGE_QUESTION, GET_ONE_CHALLENGE_QUESTION_FAIL, CHALLENGE_QUESTIONS_LOADING, ADD_CHALLENGE_QUESTION, UPDATE_CHALLENGE_QUESTION, UPDATE_CHALLENGE_QUESTION_FAIL, DELETE_CHALLENGE_QUESTION, ADD_CHALLENGE_QUESTION_FAIL, DELETE_CHALLENGE_QUESTION_FAIL } from "./challengeQuestions.types";

const INITIAL_STATE = {
  chQuestions: [],
  oneChQuestion: '',
  isLoading: true
};

const challengeQuestionsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_CHALLENGE_QUESTIONS:
      return {
        ...state,
        isLoading: false,
        chQuestions: action.payload
      };

    case GET_ONE_CHALLENGE_QUESTION:
      return {
        ...state,
        isLoading: false,
        oneChQuestion: action.payload
      };

    case ADD_CHALLENGE_QUESTION:
      return {
        ...state,
        chQuestions: [...state.chQuestions, action.payload]
      };

    case ADD_CHALLENGE_QUESTION_FAIL:
    case GET_ONE_CHALLENGE_QUESTION_FAIL:
    case DELETE_CHALLENGE_QUESTION_FAIL:
    case UPDATE_CHALLENGE_QUESTION_FAIL:
      return {
        ...state,
        chQuestions: null,
        oneChQuestion: '',
        isLoading: false
      };

    case UPDATE_CHALLENGE_QUESTION:
      return {
        ...state,
        chQuestions: state.chQuestions.map((question) => {

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

    case DELETE_CHALLENGE_QUESTION:
      return {
        ...state,
        chQuestions: state.chQuestions.filter(question => question._id !== action.payload)
      }

    case CHALLENGE_QUESTIONS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default challengeQuestionsReducer;