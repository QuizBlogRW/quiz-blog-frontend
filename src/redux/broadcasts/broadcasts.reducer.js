import { SET_BROADCASTS, SET_BROADCASTS_FAIL, GET_ONE_BROADCAST, GET_ONE_BROADCAST_FAIL, CREATE_BROADCAST, CREATE_BROADCAST_FAIL, DELETE_BROADCAST, DELETE_BROADCAST_FAIL, BROADCASTS_LOADING } from "./broadcasts.types"

const INITIAL_STATE = {
  allBroadcasts: [],
  isLoading: true,
  oneBroadcast: ''
}

const broadcastsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case SET_BROADCASTS:
      return {
        ...state,
        isLoading: false,
        allBroadcasts: action.payload
      }

    case GET_ONE_BROADCAST:
      return {
        ...state,
        isLoading: false,
        oneBroadcast: action.payload
      }

    case CREATE_BROADCAST:
      return {
        ...state,
        allBroadcasts: [...state.allBroadcasts, action.payload]
      }

    case SET_BROADCASTS_FAIL:
    case CREATE_BROADCAST_FAIL:
    case DELETE_BROADCAST_FAIL:
    case GET_ONE_BROADCAST_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    case DELETE_BROADCAST:
      return {
        ...state,
        allBroadcasts: state.allBroadcasts.filter(brdcst => brdcst._id !== action.payload)
      }

    case BROADCASTS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    default:
      return state
  }
}

export default broadcastsReducer