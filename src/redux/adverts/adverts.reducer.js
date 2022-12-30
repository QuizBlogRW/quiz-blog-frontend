import { GET_ADVERTS, GET_ADVERTS_FAIL, GET_ONE_ADVERT, GET_ONE_ADVERT_FAIL, CREATE_ADVERT, CREATE_ADVERT_FAIL, DELETE_ADVERT, DELETE_ADVERT_FAIL, UPDATE_ADVERT, UPDATE_ADVERT_FAIL, ADVERTS_LOADING } from "./adverts.types"

const INITIAL_STATE = {
  allAdverts: [],
  isLoading: true,
  oneAdvert: ''
}

const advertsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_ADVERTS:
      return {
        ...state,
        isLoading: false,
        allAdverts: action.payload
      }

    case GET_ONE_ADVERT:
      return {
        ...state,
        isLoading: false,
        oneAdvert: action.payload
      }

    case CREATE_ADVERT:
      return {
        ...state,
        allAdverts: [...state.allAdverts, action.payload]
      }

    case GET_ADVERTS_FAIL:
    case CREATE_ADVERT_FAIL:
    case DELETE_ADVERT_FAIL:
    case UPDATE_ADVERT_FAIL:
    case GET_ONE_ADVERT_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    case UPDATE_ADVERT:
      return {
        ...state,
        allAdverts: state.allAdverts.map((advert) => {

          if (advert._id === action.payload.advertID) {

            return {
              ...advert,
              title: action.payload.title,
              answer: action.payload.answer
            }

          } else return advert;
        })
      }

    case DELETE_ADVERT:
      return {
        ...state,
        allAdverts: state.allAdverts.filter(advert => advert._id !== action.payload)
      }

    case ADVERTS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default advertsReducer