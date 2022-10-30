import { GET_FAQS, GET_FAQS_FAIL, GET_ONE_FAQ, GET_ONE_FAQ_FAIL, CREATE_FAQ, CREATE_FAQ_FAIL, DELETE_FAQ, DELETE_FAQ_FAIL, UPDATE_FAQ, UPDATE_FAQ_FAIL, FAQS_LOADING } from "./faqs.types"

const INITIAL_STATE = {
  allFaqs: [],
  isLoading: true,
  oneFaq: ''
}

const faqsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_FAQS:
      return {
        ...state,
        isLoading: false,
        allFaqs: action.payload
      }

    case GET_ONE_FAQ:
      return {
        ...state,
        isLoading: false,
        oneFaq: action.payload
      }

    case CREATE_FAQ:
      return {
        ...state,
        allFaqs: [...state.allFaqs, action.payload]
      }

    case GET_FAQS_FAIL:
    case CREATE_FAQ_FAIL:
    case DELETE_FAQ_FAIL:
    case UPDATE_FAQ_FAIL:
    case GET_ONE_FAQ_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    case UPDATE_FAQ:
      return {
        ...state,
        allFaqs: state.allFaqs.map((faq) => {

          if (faq._id === action.payload.faqID) {

            return {
              ...faq,
              title: action.payload.title,
              answer: action.payload.answer
            }

          } else return faq;
        })
      }

    case DELETE_FAQ:
      return {
        ...state,
        allFaqs: state.allFaqs.filter(brdcst => brdcst._id !== action.payload)
      }

    case FAQS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default faqsReducer