import { GET_POST_CATEGORIES, GET_POST_CATEGORIES_FAIL, CREATE_POST_CATEGORY, CREATE_POST_CATEGORY_FAIL, DELETE_POST_CATEGORY, DELETE_POST_CATEGORY_FAIL, UPDATE_POST_CATEGORY, UPDATE_POST_CATEGORY_FAIL, POST_CATEGORIES_LOADING } from "./postCategories.types";

const INITIAL_STATE = {
  allPostCategories: [],
  isLoading: true
};

const postCategoriesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_POST_CATEGORIES:
      return {
        ...state,
        isLoading: false,
        allPostCategories: action.payload
      };

    case CREATE_POST_CATEGORY:
      return {
        ...state,
        allPostCategories: [...state.allPostCategories, action.payload]
      };

    case CREATE_POST_CATEGORY_FAIL:
    case DELETE_POST_CATEGORY_FAIL:
    case UPDATE_POST_CATEGORY_FAIL:
    case GET_POST_CATEGORIES_FAIL:
      return {
        ...state,
        isLoading: false,
        msg: "Failed!"
      };

    case UPDATE_POST_CATEGORY:
      return {
        ...state,
        allPostCategories: state.allPostCategories.map((catg) => {

          if (catg._id === action.payload.idToUpdate) {

            return {
              ...catg,
              title: action.payload.title,
              description: action.payload.description
            }

          } else return catg;
        })
      }

    case DELETE_POST_CATEGORY:
      return {
        ...state,
        allPostCategories: state.allPostCategories.filter(catg => catg._id !== action.payload)
      }

    case POST_CATEGORIES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state;
  }
};

export default postCategoriesReducer;