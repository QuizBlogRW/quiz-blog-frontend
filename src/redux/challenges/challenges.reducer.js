import { GET_CHALLENGES, GET_ONE_CHALLENGE, GET_ONE_CHALLENGE_FAIL, GET_CHALLENGER_CHALLENGES, GET_CHALLENGER_CHALLENGES_FAIL, CREATE_CHALLENGE, CREATE_CHALLENGE_FAIL, DELETE_CHALLENGE, DELETE_CHALLENGE_FAIL, UPDATE_CHALLENGE, UPDATE_CHALLENGE_FAIL, CHALLENGES_LOADING } from "./challenges.types";

const INITIAL_STATE = {
  allChallenges: [],
  totalPages: [],
  oneChallenge: '',
  ChallengerChallenges: [],
  isLoading: true
};

const challengesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_CHALLENGES:
      return {
        ...state,
        isLoading: false,
        allChallenges: action.payload.challenges,
        totalPages: action.payload.totalPages
      };

    case GET_CHALLENGER_CHALLENGES:
      return {
        ...state,
        isLoading: false,
        ChallengerChallenges: action.payload
      };

    case GET_ONE_CHALLENGE:
      return {
        ...state,
        isLoading: false,
        oneChallenge: action.payload
      };

    case CREATE_CHALLENGE:
      return {
        ...state,
        allChallenges: [...state.allChallenges, action.payload]
      };

    case CREATE_CHALLENGE_FAIL:
    case DELETE_CHALLENGE_FAIL:
    case UPDATE_CHALLENGE_FAIL:
    case GET_ONE_CHALLENGE_FAIL:
    case GET_CHALLENGER_CHALLENGES_FAIL:
      return {
        ...state,
        msg: "Failed!"
      };

    case UPDATE_CHALLENGE:
      return {
        ...state,
        allChallenges: state.allChallenges.map((challenge) => {

          if (challenge._id === action.payload.sId) {

            return {
              ...challenge,
              challengeeReview: action.payload.challengeeReview
            }

          } else return challenge;
        })
      }

    case DELETE_CHALLENGE:
      return {
        ...state,
        allChallenges: state.allChallenges.filter(challenge => challenge._id !== action.payload)
      }

    case CHALLENGES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default challengesReducer;