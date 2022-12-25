import { GET_CONTACTS, GET_CONTACT, GET_ONE_CONTACT, GET_ONE_CONTACT_FAIL, ONE_CONTACT_LOADING, ADD_CONTACT, DELETE_CONTACT, ADD_CONTACT_FAIL, DELETE_CONTACT_FAIL, CONTACTS_LOADING, REPLY_CONTACT, REPLY_CONTACT_FAIL, GET_USER_CONTACTS, GET_USER_CONTACTS_FAIL, GET_ROOM_MESSAGES, GET_ROOM_MESSAGES_FAIL, ROOM_LOADING, ADD_ROOMS_MESSAGE, ADD_ROOMS_MESSAGE_FAIL, GET_CREATE_CHAT_ROOM, GET_CREATE_CHAT_ROOM_FAIL } from "./contacts.types"

const INITIAL_STATE = {
  allContacts: [],
  userContacts: [],
  oneContact: null,
  totalPages: 0,

  oneChatRoom: null,
  roomsMessages: [],
  oneRoomMessages: [],

  isLoading: true,
  isOneLoading: true,
  isRoomLoading: true,
}

const contactsReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case GET_CONTACTS:
      return {
        ...state,
        isLoading: false,
        allContacts: action.payload.contacts,
        totalPages: action.payload.totalPages,
      }

    case GET_ONE_CONTACT:
      return {
        ...state,
        isOneLoading: false,
        oneContact: action.payload
      }

    case GET_CREATE_CHAT_ROOM:
      return {
        ...state,
        isRoomLoading: false,
        oneChatRoom: action.payload
      }

    case GET_ROOM_MESSAGES:
      return {
        ...state,
        isRoomLoading: false,
        oneRoomMessages: action.payload
      }

    case ADD_ROOMS_MESSAGE:
      return {
        ...state,
        roomsMessages: [...state.roomsMessages, action.payload]
      }

    case GET_USER_CONTACTS:
      return {
        ...state,
        isLoading: false,
        userContacts: action.payload
      }

    case GET_CONTACT:
      return {
        ...state,
        allContacts: action.payload
      }
      

    case ADD_CONTACT:
      return {
        ...state,
        allContacts: [...state.allContacts, action.payload]
      }

    case ADD_CONTACT_FAIL:
    case DELETE_CONTACT_FAIL:
    case REPLY_CONTACT_FAIL:
    case GET_USER_CONTACTS_FAIL:
    case GET_ONE_CONTACT_FAIL:
    case GET_ROOM_MESSAGES_FAIL:
    case ADD_ROOMS_MESSAGE_FAIL:
    case GET_CREATE_CHAT_ROOM_FAIL:
      return {
        ...state,
        allContacts: [],
        userContacts: [],
        oneContact: null,
        oneRoomMessages: [],
        roomsMessages: []
      }

    case DELETE_CONTACT:
      return {
        ...state,
        allContacts: state.allContacts.filter(contact => contact._id !== action.payload)
      }

    case REPLY_CONTACT:
      return {
        ...state,
        allContacts: state.allContacts.map((cont) => {

          if (cont._id === action.payload.idToUpdate) {

            return {
              ...cont,
              reply: action.payload.reply
            }

          } else return cont
        })
      }


    case CONTACTS_LOADING:
      return {
        ...state,
        isLoading: true
      }

    case ONE_CONTACT_LOADING:
      return {
        ...state,
        isOneLoading: true
      }

    case ROOM_LOADING:
      return {
        ...state,
        isRoomLoading: true
      }

    default:
      return state
  }
}

export default contactsReducer
