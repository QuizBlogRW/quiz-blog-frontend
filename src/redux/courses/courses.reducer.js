import { GET_COURSES, GET_ONE_COURSE, ONE_COURSE_LOADING, GET_ONE_COURSE_FAIL, GET_COURSES_FAIL, CREATE_COURSE, CREATE_COURSE_FAIL, DELETE_COURSE, DELETE_COURSE_FAIL, UPDATE_COURSE, UPDATE_COURSE_FAIL, GET_COURSES_BY_CATEGORY, GET_COURSES_BY_CATEGORY_FAIL, COURSES_BYCAT_LOADING, COURSES_LOADING } from "./courses.types";

const INITIAL_STATE = {
  allCourses: [],
  coursesByCategory: [],
  oneCourse: {},
  isOneCourseLoading: true,
  isLoading: true,
  isByCatLoading: true
};

const coursesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_COURSES:
      return {
        ...state,
        isLoading: false,
        allCourses: action.payload
      };

    case GET_ONE_COURSE:
      return {
        ...state,
        isOneCourseLoading: false,
        oneCourse: action.payload
      };

    case GET_COURSES_BY_CATEGORY:
      return {
        ...state,
        isByCatLoading: false,
        coursesByCategory: action.payload
      };

    case CREATE_COURSE:
      return {
        ...state,
        allCourses: [...state.allCourses, action.payload]
      };

    case CREATE_COURSE_FAIL:
    case DELETE_COURSE_FAIL:
    case UPDATE_COURSE_FAIL:
    case GET_COURSES_FAIL:
    case GET_ONE_COURSE_FAIL:
    case GET_COURSES_BY_CATEGORY_FAIL:
      return {
        ...state,
        isOneCourseLoading: false,
        isLoading: false,
        isByCatLoading: false,
        msg: "Failed!"
      };

    case UPDATE_COURSE:
      return {
        ...state,
        allCourses: state.allCourses.map((course) => {

          if (course._id === action.payload.idToUpdate) {

            return {
              ...course,
              title: action.payload.title,
              description: action.payload.description,
              last_updated_by: action.payload.last_updated_by
            }

          } else return course;
        })
      }

    case DELETE_COURSE:
      return {
        ...state,
        allCourses: state.allCourses.filter(course => course._id !== action.payload)
      }

    case COURSES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case ONE_COURSE_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case COURSES_BYCAT_LOADING:
      return {
        ...state,
        isByCatLoading: true
      }

    default:
      return state;
  }
};

export default coursesReducer;