import { SET_CATEGORIES, GET_ONE_CATEGORY, GET_ONE_CATEGORY_FAIL, CREATE_CATEGORY, CREATE_CATEGORY_FAIL, DELETE_CATEGORY, DELETE_CATEGORY_FAIL, UPDATE_CATEGORY, UPDATE_CATEGORY_FAIL, CATEGORY_LOADING, CATEGORIES_LOADING } from "./categories.types";

const INITIAL_STATE = {
  allcategories: [],
  isLoading: true,
  isOneLoading: true,
  oneCategory: ''
};

const categoriesReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_CATEGORIES:
      return {
        ...state,
        isLoading: false,
        allcategories: action.payload
      };

    case GET_ONE_CATEGORY:
      return {
        ...state,
        isOneLoading: false,
        oneCategory: action.payload
      };

    case CREATE_CATEGORY:
      return {
        ...state,
        allcategories: [...state.allcategories, action.payload]
      };

    case CREATE_CATEGORY_FAIL:
    case DELETE_CATEGORY_FAIL:
    case UPDATE_CATEGORY_FAIL:
    case GET_ONE_CATEGORY_FAIL:
      return {
        ...state,
        msg: "Failed!"
      };

    case UPDATE_CATEGORY:
      return {
        ...state,
        allcategories: state.allcategories.map((catg) => {

          if (catg._id === action.payload.catID) {

            return {
              ...catg,
              title: action.payload.title,
              description: action.payload.description,
              last_updated_by: action.payload.last_updated_by
            }

          } else return catg;
        })
      }

    case DELETE_CATEGORY:
      return {
        ...state,
        allcategories: state.allcategories.filter(catg => catg._id !== action.payload)
      }

    case CATEGORIES_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case CATEGORY_LOADING:
      return {
        ...state,
        isOneLoading: true
      }

    default:
      return state;
  }
};

export default categoriesReducer;