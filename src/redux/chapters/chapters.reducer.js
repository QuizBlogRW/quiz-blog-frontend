import { GET_CHAPTERS, GET_CHAPTERS_FAIL, CREATE_CHAPTER, CREATE_CHAPTER_FAIL, DELETE_CHAPTER, DELETE_CHAPTER_FAIL, UPDATE_CHAPTER, UPDATE_CHAPTER_FAIL, CHAPTERS_LOADING, CHAPTERS_BY_COURSE_LOADING, GET_CHAPTERS_BY_COURSE, GET_CHAPTERS_BY_COURSE_FAIL } from "./chapters.types";

const INITIAL_STATE = {
  allChapters: [],
  isLoading: true,
  chaptersByCourse: [],
  isByCourseLoading: true
};

const chaptersReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_CHAPTERS:
      return {
        ...state,
        isLoading: false,
        allChapters: action.payload
      };

    case GET_CHAPTERS_BY_COURSE:
      return {
        ...state,
        isByCourseLoading: false,
        chaptersByCourse: action.payload
      };

    case CREATE_CHAPTER:
      return {
        ...state,
        allChapters: [...state.allChapters, action.payload]
      };

    case CREATE_CHAPTER_FAIL:
    case DELETE_CHAPTER_FAIL:
    case UPDATE_CHAPTER_FAIL:
    case GET_CHAPTERS_FAIL:
    case GET_CHAPTERS_BY_COURSE_FAIL:
      return {
        ...state,
        msg: "Failed!"
      };

    case UPDATE_CHAPTER:
      return {
        ...state,
        allChapters: state.allChapters.map((chapter) => {

          if (chapter._id === action.payload.idToUpdate) {

            return {
              ...chapter,
              title: action.payload.title,
              description: action.payload.description,
              last_updated_by: action.payload.last_updated_by
            }

          } else return chapter;
        })
      }

    case DELETE_CHAPTER:
      return {
        ...state,
        allChapters: state.allChapters.filter(chapter => chapter._id !== action.payload)
      }

    case CHAPTERS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case CHAPTERS_BY_COURSE_LOADING:
      return {
        ...state,
        isByCourseLoading: true
      }

    default:
      return state;
  }
};

export default chaptersReducer;