import { GET_FACULTIES, GET_FACULTIES_FAIL, CREATE_FACULTY, CREATE_FACULTY_FAIL, DELETE_FACULTY, DELETE_FACULTY_FAIL, UPDATE_FACULTY, UPDATE_FACULTY_FAIL, FACULTIES_LOADING, FETCH_LEVEL_FACULTIES, FETCH_LEVEL_FACULTIES_FAIL } from "./faculties.types";

const INITIAL_STATE = {
  allFaculties: [],
  isLoading: true,
  levelFaculties: []
};

const facultiesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_FACULTIES:
      return {
        ...state,
        isLoading: false,
        allFaculties: action.payload
      };

    case FETCH_LEVEL_FACULTIES:
      return {
        ...state,
        isLoading: false,
        levelFaculties: action.payload
      };

    case CREATE_FACULTY:
      return {
        ...state,
        allFaculties: [...state.allFaculties, action.payload]
      };

    case CREATE_FACULTY_FAIL:
    case DELETE_FACULTY_FAIL:
    case UPDATE_FACULTY_FAIL:
    case GET_FACULTIES_FAIL:
    case FETCH_LEVEL_FACULTIES_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_FACULTY:
      return {
        ...state,
        allFaculties: state.allFaculties.map((fac) => {

          if (fac._id === action.payload.idToUpdate) {

            return {
              ...fac,
              title: action.payload.title,
              degree: action.payload.degree
            }

          } else return fac;
        })
      }

    case DELETE_FACULTY:
      return {
        ...state,
        allFaculties: state.allFaculties.filter(fac => fac._id !== action.payload)
      }

    case FACULTIES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default facultiesReducer;