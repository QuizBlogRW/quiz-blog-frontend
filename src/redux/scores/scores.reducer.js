import { GET_SCORES, GET_ONE_SCORE, GET_ONE_SCORE_FAIL, GET_TAKER_SCORES, GET_TAKER_SCORES_FAIL, CREATE_SCORE, CREATE_SCORE_FAIL, DELETE_SCORE, DELETE_SCORE_FAIL, UPDATE_SCORE, UPDATE_SCORE_FAIL, SCORES_LOADING, GET_CREATOR_SCORES, GET_CREATOR_SCORES_FAIL, GET_POPULAR_QUIZES, GET_POPULAR_QUIZES_FAIL, GET_MONTHLY_USER, GET_MONTHLY_USER_FAIL, GET_RANKING_SCORES, GET_RANKING_SCORES_FAIL } from "./scores.types"

const INITIAL_STATE = {
  allScores: [],
  totalPages: 0,
  oneScore: '',
  monthlyUser: '',
  takerScores: [],
  rankingScores: [],
  creatorScores: [],
  popularQuizes: [],
  isLoading: true
}

const scoresReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_SCORES:
      return {
        ...state,
        isLoading: false,
        allScores: action.payload.scores,
        totalPages: action.payload.totalPages,
      }

    case GET_TAKER_SCORES:
      return {
        ...state,
        isLoading: false,
        takerScores: action.payload
      }

    case GET_RANKING_SCORES:
      return {
        ...state,
        isLoading: false,
        rankingScores: action.payload
      }

    case GET_CREATOR_SCORES:
      return {
        ...state,
        isLoading: false,
        creatorScores: action.payload
      }

    case GET_ONE_SCORE:
      return {
        ...state,
        isLoading: false,
        oneScore: action.payload,
      }

    case GET_POPULAR_QUIZES:
      return {
        ...state,
        isLoading: false,
        popularQuizes: action.payload,
      }

    case GET_MONTHLY_USER:
      return {
        ...state,
        isLoading: false,
        monthlyUser: action.payload
      }

    case CREATE_SCORE:
      return {
        ...state,
        allScores: [...state.allScores, action.payload],
        isLoading: false,
      }

    case CREATE_SCORE_FAIL:
    case DELETE_SCORE_FAIL:
    case UPDATE_SCORE_FAIL:
    case GET_ONE_SCORE_FAIL:
    case GET_TAKER_SCORES_FAIL:
    case GET_CREATOR_SCORES_FAIL:
    case GET_POPULAR_QUIZES_FAIL:
    case GET_MONTHLY_USER_FAIL:
    case GET_RANKING_SCORES_FAIL:
      return {
        ...state,
        msg: "Failed!",
        isLoading: false,
      }

    case UPDATE_SCORE:
      return {
        ...state,
        isLoading: false,
        allScores: state.allScores.map((score) => {

          if (score._id === action.payload.sId) {

            return {
              ...score,
              title: action.payload.title,
              description: action.payload.description,
              last_updated_by: action.payload.last_updated_by
            }

          } else return score
        })
      }

    case DELETE_SCORE:
      return {
        ...state,
        allScores: state.allScores.filter(score => score._id !== action.payload),
        isLoading: false
      }

    case SCORES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default scoresReducer