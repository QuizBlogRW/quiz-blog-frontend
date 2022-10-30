import { GET_CHALLENGE_SCORES, GET_ONE_CHALLENGE_SCORE, GET_ONE_CHALLENGE_SCORE_FAIL, GET_TAKER_CHALLENGE_SCORES, GET_TAKER_CHALLENGE_SCORES_FAIL, CREATE_CHALLENGE_SCORE, CREATE_CHALLENGE_SCORE_FAIL, DELETE_CHALLENGE_SCORE, DELETE_CHALLENGE_SCORE_FAIL, UPDATE_CHALLENGE_SCORE, UPDATE_CHALLENGE_SCORE_FAIL, CHALLENGE_SCORES_LOADING, GET_CREATOR_CHALLENGE_SCORES, GET_CREATOR_CHALLENGE_SCORES_FAIL, GET_RANKING_CHALLENGE_SCORES } from "./challengeScores.types"

const INITIAL_STATE = {
  allChScores: [],
  totalPages: 0,
  oneChScore: '',
  takerChScores: [],
  rankingChScores: [],
  creatorChScores: [],
  isLoading: true
}

const challengeScoresReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_CHALLENGE_SCORES:
      return {
        ...state,
        isLoading: false,
        allChScores: action.payload.scores,
        totalPages: action.payload.totalPages,
      }

    case GET_TAKER_CHALLENGE_SCORES:
      return {
        ...state,
        isLoading: false,
        takerChScores: action.payload
      }

    case GET_RANKING_CHALLENGE_SCORES:
      return {
        ...state,
        isLoading: false,
        rankingChScores: action.payload
      }

    case GET_CREATOR_CHALLENGE_SCORES:
      return {
        ...state,
        isLoading: false,
        creatorChScores: action.payload
      }

    case GET_ONE_CHALLENGE_SCORE:
      return {
        ...state,
        isLoading: false,
        oneChScore: action.payload,
      }

    case CREATE_CHALLENGE_SCORE:
      return {
        ...state,
        allChScores: [...state.allChScores, action.payload]
      }

    case CREATE_CHALLENGE_SCORE_FAIL:
    case DELETE_CHALLENGE_SCORE_FAIL:
    case UPDATE_CHALLENGE_SCORE_FAIL:
    case GET_ONE_CHALLENGE_SCORE_FAIL:
    case GET_TAKER_CHALLENGE_SCORES_FAIL:
    case GET_CREATOR_CHALLENGE_SCORES_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    case UPDATE_CHALLENGE_SCORE:
      return {
        ...state,
        allChScores: state.allChScores.map((chScore) => {

          if (chScore._id === action.payload.sId) {

            return {
              ...chScore,
              title: action.payload.title,
              description: action.payload.description,
              duration: action.payload.duration,
              last_updated_by: action.payload.last_updated_by
            }

          } else return chScore
        })
      }

    case DELETE_CHALLENGE_SCORE:
      return {
        ...state,
        allChScores: state.allChScores.filter(chScore => chScore._id !== action.payload)
      }

    case CHALLENGE_SCORES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default challengeScoresReducer