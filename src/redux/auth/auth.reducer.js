import { USER_LOADED, USER_LOADING, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL, GET_USERS, DELETE_USER, UPDATE_USER, DELETE_USER_FAIL, UPDATE_USER_FAIL, USERS_LOADING, RESET_PASSWORD, FORGOT_PASSWORD, UNEXISTING_EMAIL, UPDATE_PROFILE, UPDATE_PROFILE_FAIL, UPDATE_PROFILE_IMAGE, UPDATE_PROFILE_IMAGE_FAIL } from "./auth.types"

const INITIAL_STATE = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  isLoading: false,
  user: null,
  users: [],
  // totalPages: [],
  pswdResetToken: null
}

const authReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_USERS:
      return {
        ...state,
        isLoading: false,
        // totalPages: action.payload.totalPages,
        users: action.payload
      }

    case USER_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload
      }

    case LOGIN_SUCCESS:
    case REGISTER_SUCCESS:
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      }

    case AUTH_ERROR:
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case REGISTER_FAIL:
    case UPDATE_PROFILE_FAIL:
    case UPDATE_PROFILE_IMAGE_FAIL:
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      }

    //Users CRUD 
    case DELETE_USER_FAIL:
    case UPDATE_USER_FAIL:
    case UNEXISTING_EMAIL:
      return {
        ...state,
        msg: "Failed!"
      }

    case UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) => {

          if (user._id === action.payload.uId) {

            return {
              ...user,
              name: action.payload.name,
              role: action.payload.role,
              email: action.payload.email
            }

          } else return user
        })
      }

    case UPDATE_PROFILE:
      return {
        ...state,
        users: state.users.map((user) => {

          if (user._id === action.payload.uId) {

            return {
              ...user,
              name: action.payload.name,
              school: action.payload.school,
              level: action.payload.level,
              faculty: action.payload.faculty,
              year: action.payload.year,
              about: action.payload.about,
              interests: action.payload.interests
            }

          } else return user
        })
      }

    case UPDATE_PROFILE_IMAGE:
      return {
        ...state,
        users: state.users.map((user) => {

          if (user._id === action.payload.uId) {

            return {
              ...user,
              image: action.payload.image
            }

          } else return user
        })
      }


    case FORGOT_PASSWORD:
      return {
        ...state,
        email: state.users.find(user =>
          user.email === action.payload.email ? action.payload.email : null)
      }


    case RESET_PASSWORD:
      return {
        ...state,
        users: state.users.map((user) => {

          if (user._id === action.payload.userId) {

            return {
              ...user,
              token: action.payload.token,
              password: action.payload.password
            }

          } else return user
        })
      }

    case DELETE_USER:
      return {
        ...state,
        users: state.users.filter(user => user._id !== action.payload)
      }

    case USERS_LOADING:
      return {
        ...state,
        isLoading: true
      }


    default:
      return state
  }
}

export default authReducer