import { GET_SCHOOLS, GET_SCHOOLS_FAIL, CREATE_SCHOOL, CREATE_SCHOOL_FAIL, DELETE_SCHOOL, DELETE_SCHOOL_FAIL, UPDATE_SCHOOL, UPDATE_SCHOOL_FAIL, SCHOOLS_LOADING, GET_ONE_SCHOOL, GET_ONE_SCHOOL_FAIL } from "./schools.types";

const INITIAL_STATE = {
  allSchools: [],
  isLoading: true,
  oneSchool: {}
};

const schoolsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_SCHOOLS:
      return {
        ...state,
        isLoading: false,
        allSchools: action.payload
      };

    case GET_ONE_SCHOOL:
      return {
        ...state,
        isLoading: false,
        oneSchool: action.payload
      };

    case CREATE_SCHOOL:
      return {
        ...state,
        allSchools: [...state.allSchools, action.payload]
      };

    case CREATE_SCHOOL_FAIL:
    case DELETE_SCHOOL_FAIL:
    case UPDATE_SCHOOL_FAIL:
    case GET_SCHOOLS_FAIL:
    case GET_ONE_SCHOOL_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_SCHOOL:
      return {
        ...state,
        allSchools: state.allSchools.map((sch) => {

          if (sch._id === action.payload.idToUpdate) {

            return {
              ...sch,
              title: action.payload.title,
              location: action.payload.location,
              website: action.payload.website
            }

          } else return sch;
        })
      }

    case DELETE_SCHOOL:
      return {
        ...state,
        allSchools: state.allSchools.filter(sch => sch._id !== action.payload)
      }

    case SCHOOLS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default schoolsReducer;