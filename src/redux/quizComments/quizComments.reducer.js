import { GET_COMMENTS, GET_COMMENTS_FAIL, GET_ONE_COMMENT, GET_ONE_COMMENT_FAIL, GET_QUIZ_COMMENTS,GET_QUIZ_COMMENTS_FAIL, CREATE_COMMENT, CREATE_COMMENT_FAIL, DELETE_COMMENT, DELETE_COMMENT_FAIL, UPDATE_COMMENT, UPDATE_COMMENT_FAIL, COMMENTS_LOADING } from "./quizComments.types"

const INITIAL_STATE = {
  allComments: [],
  isLoading: true,
  oneComment: '',
  quizCmnts: []
}

const quizCommentsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_COMMENTS:
      return {
        ...state,
        isLoading: false,
        allComments: action.payload
      }

    case GET_QUIZ_COMMENTS:
      return {
        ...state,
        isLoading: false,
        quizCmnts: action.payload
      }

    case GET_ONE_COMMENT:
      return {
        ...state,
        isLoading: false,
        oneComment: action.payload
      }

    case CREATE_COMMENT:
      return {
        ...state,
        allComments: [...state.allComments, action.payload]
      }

    case GET_COMMENTS_FAIL:
    case CREATE_COMMENT_FAIL:
    case DELETE_COMMENT_FAIL:
    case UPDATE_COMMENT_FAIL:
    case GET_ONE_COMMENT_FAIL:
    case GET_QUIZ_COMMENTS_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    case UPDATE_COMMENT:
      return {
        ...state,
        allComments: state.allComments.map((comment) => {

          if (comment._id === action.payload.commentID) {

            return {
              ...comment,
              title: action.payload.title,
              answer: action.payload.answer
            }

          } else return comment;
        })
      }

    case DELETE_COMMENT:
      return {
        ...state,
        allComments: state.allComments.filter(cmnt => cmnt._id !== action.payload)
      }

    case COMMENTS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default quizCommentsReducer