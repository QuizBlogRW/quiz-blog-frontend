import { SET_POSTS, SUBSCRIBETONEWSLETTER, SET_SUBSCRIBERS, SUBSCRIBE_FAIL, DELETE_SUBSCRIBER, DELETE_SUBSCRIBER_FAIL, SUBSCRIBERS_LOADING } from "./subscribers.types";

const INITIAL_STATE = {
  subscribedUsers: [],
  isLoading: true
};

const subscribersReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_POSTS:
      return {
        ...state,
        isLoading: false
      };

    case SET_SUBSCRIBERS:
      return {
        ...state,
        isLoading: false,
        subscribedUsers: action.payload
      };

    case SUBSCRIBETONEWSLETTER:
      return {
        ...state,
        subscribedUsers: [...state.subscribedUsers, action.payload]
      };

    case SUBSCRIBE_FAIL:
    case DELETE_SUBSCRIBER_FAIL:
      return {
        ...state,
        subscribedUsers: null
      };

      case DELETE_SUBSCRIBER:
        return {
          ...state,
          subscribedUsers: state.subscribedUsers.filter(subscriber => subscriber.email !== action.uemail)
        }

        case SUBSCRIBERS_LOADING:
          return {
            ...state,
            isLoading: true
          }
    

    default:
      return state;
  }
};

export default subscribersReducer;
