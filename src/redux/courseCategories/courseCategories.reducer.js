import { GET_COURSE_CATEGORIES, GET_COURSE_CATEGORIES_FAIL, CREATE_COURSE_CATEGORY, CREATE_COURSE_CATEGORY_FAIL, DELETE_COURSE_CATEGORY, DELETE_COURSE_CATEGORY_FAIL, UPDATE_COURSE_CATEGORY, UPDATE_COURSE_CATEGORY_FAIL, COURSE_CATEGORIES_LOADING } from "./courseCategories.types";

const INITIAL_STATE = {
  allCourseCategories: [],
  isLoading: true
};

const courseCategoriesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_COURSE_CATEGORIES:
      return {
        ...state,
        isLoading: false,
        allCourseCategories: action.payload
      };

    case CREATE_COURSE_CATEGORY:
      return {
        ...state,
        allCourseCategories: [...state.allCourseCategories, action.payload]
      };

    case CREATE_COURSE_CATEGORY_FAIL:
    case DELETE_COURSE_CATEGORY_FAIL:
    case UPDATE_COURSE_CATEGORY_FAIL:
    case GET_COURSE_CATEGORIES_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_COURSE_CATEGORY:
      return {
        ...state,
        allCourseCategories: state.allCourseCategories.map((catg) => {

          if (catg._id === action.payload.idToUpdate) {

            return {
              ...catg,
              title: action.payload.title,
              description: action.payload.description,
              last_updated_by: action.payload.last_updated_by
            }

          } else return catg;
        })
      }

    case DELETE_COURSE_CATEGORY:
      return {
        ...state,
        allCourseCategories: state.allCourseCategories.filter(catg => catg._id !== action.payload)
      }

    case COURSE_CATEGORIES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default courseCategoriesReducer;