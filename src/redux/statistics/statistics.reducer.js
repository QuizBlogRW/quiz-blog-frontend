import { GET_50_NEW_USERS, GET_50_NEW_USERS_FAIL, NEW_50_USERS_LOADING } from "./statistics.types"

const INITIAL_STATE = {
  new50Users: [],
  is50newUsersLoading: true
}

const statisticsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_50_NEW_USERS_FAIL:
      return {
        ...state,
        new50Users: [],
        is50newUsersLoading: false,
      }

    case GET_50_NEW_USERS:
      return {
        ...state,
        is50newUsersLoading: false,
        new50Users: action.payload
      }

    case NEW_50_USERS_LOADING:
      return {
        ...state,
        is50newUsersLoading: true
      }

    default:
      return state
  }
}

export default statisticsReducer