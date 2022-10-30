import { GET_LOGS, GET_LOGS_FAIL, LOGS_LOADING, GET_LOG, GET_LOG_FAIL, LOG_LOADING, DELETE_LOG, DELETE_LOG_FAIL } from "./logs.types"

const INITIAL_STATE = {
  isLogsLoading: false,
  isLogLoading: false,
  log: null,
  logs: []
}

const logsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    
    case GET_LOGS:
      return {
        ...state,
        isLogsLoading: false,
        logs: action.payload
      }

    case LOGS_LOADING:
      return {
        ...state,
        isLogsLoading: true
      }

    case GET_LOG:
      return {
        ...state,
        isLogLoading: false,
        log: action.payload
      }

    case LOG_LOADING:
      return {
        ...state,
        isLogLoading: true
      }

    case DELETE_LOG:
      return {
        ...state,
        logs: state.logs.filter(log => log._id !== action.payload)
      }

    case GET_LOGS_FAIL:
    case GET_LOG_FAIL:
    case DELETE_LOG_FAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    default:
      return state
  }
}

export default logsReducer