import { GET_LEVELS, GET_LEVELS_FAIL, CREATE_LEVEL, CREATE_LEVEL_FAIL, DELETE_LEVEL, DELETE_LEVEL_FAIL, UPDATE_LEVEL, UPDATE_LEVEL_FAIL, LEVELS_LOADING, FETCH_SCHOOL_LEVELS, FETCH_SCHOOL_LEVELS_FAIL } from "./levels.types";

const INITIAL_STATE = {
  allLevels: [],
  isLoading: true,
  schoolLevels: []
};

const levelsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_LEVELS:
      return {
        ...state,
        isLoading: false,
        allLevels: action.payload
      };

    case FETCH_SCHOOL_LEVELS:
      return {
        ...state,
        isLoading: false,
        schoolLevels: action.payload
      };

    case CREATE_LEVEL:
      return {
        ...state,
        allLevels: [...state.allLevels, action.payload]
      };

    case CREATE_LEVEL_FAIL:
    case DELETE_LEVEL_FAIL:
    case UPDATE_LEVEL_FAIL:
    case GET_LEVELS_FAIL:
    case FETCH_SCHOOL_LEVELS_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_LEVEL:
      return {
        ...state,
        allLevels: state.allLevels.map((lev) => {

          if (lev._id === action.payload.idToUpdate) {

            return {
              ...lev,
              title: action.payload.title,
              school: action.payload.school
            }

          } else return lev;
        })
      }

    case DELETE_LEVEL:
      return {
        ...state,
        allLevels: state.allLevels.filter(lev => lev._id !== action.payload)
      }

    case LEVELS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default levelsReducer;