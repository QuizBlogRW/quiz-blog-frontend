import { GET_CONTACTS, GET_CONTACTS_FAIL, GET_ONE_CONTACT, GET_ONE_CONTACT_FAIL, ONE_CONTACT_LOADING, ADD_CONTACT, DELETE_CONTACT, ADD_CONTACT_FAIL, DELETE_CONTACT_FAIL, REPLY_CONTACT_FAIL, CONTACTS_LOADING, REPLY_CONTACT, GET_USER_CONTACTS, GET_USER_CONTACTS_FAIL, GET_ROOM_MESSAGES, GET_ROOM_MESSAGES_FAIL, ROOM_LOADING, ADD_ROOMS_MESSAGE, ADD_ROOMS_MESSAGE_FAIL, GET_CREATE_CHAT_ROOM, GET_CREATE_CHAT_ROOM_FAIL } from "./contacts.types";
import axios from 'axios';
import { tokenConfig } from '../auth/auth.actions'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { apiURL, devApiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? devApiURL : apiURL,
});

// dispatch(action)
// Dispatches an action. This is the only way to trigger a state change.
export const getContacts = (pageNo) => async (dispatch, getState) => {
  await dispatch(setContactsLoading());

  try {
    await axiosInstance
      .get(`/api/contacts?pageNo=${pageNo}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CONTACTS,
          payload: res.data,
        }))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_CONTACTS_FAIL'));
    dispatch({ type: GET_CONTACTS_FAIL })
  }
};

// Get one contact
export const getOneContact = (contactId) => async (dispatch, getState) => {
  await dispatch(setOneContactLoading())

  try {
    await axiosInstance
      .get(`/api/contacts/${contactId}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ONE_CONTACT,
          payload: res.data
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ONE_CONTACT_FAIL'))
    dispatch({ type: GET_ONE_CONTACT_FAIL })
  }
}

// View all msgs by a user
export const getUserContacts = (userEmail) => async (dispatch, getState) => {
  await dispatch(setContactsLoading())

  try {
    await axiosInstance
      .get(`/api/contacts/sent-by/${userEmail}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_USER_CONTACTS,
          payload: res.data
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_USER_CONTACTS_FAIL'))
    dispatch({ type: GET_USER_CONTACTS_FAIL })
  }
}

export const sendMsg = (contactMsg) => async (dispatch) => {

  try {
    await axiosInstance
      .post('/api/contacts', contactMsg)
      .then(res =>
        dispatch({
          type: ADD_CONTACT,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Your message is received', 200, 'ADD_CONTACT'),
          // Reload after 4 seconds
          // window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'ADD_CONTACT_FAIL'));
    dispatch({ type: ADD_CONTACT_FAIL })
  }
};

// Reply a contact
export const replyContact = (idToUpdate, reply) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .put(`/api/contacts/${idToUpdate}`, reply, tokenConfig(getState))
      .then(() =>
        dispatch({
          type: REPLY_CONTACT,
          payload: reply
        }))
      .then(res =>
        dispatch(
          returnSuccess('Reply sent!', 200, 'REPLY_CONTACT'),
          // Reload after 4 seconds
          // window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'REPLY_CONTACT_FAIL'));
    dispatch({ type: REPLY_CONTACT_FAIL });
  }
}

// Delete a Contact
export const deleteContact = id => async (dispatch, getState) => {

  try {
    if (window.confirm("This contact will be deleted permanently!")) {
      await axiosInstance
        .delete(`/api/contacts/${id}`, tokenConfig(getState))
        .then(res =>
          dispatch({
            type: DELETE_CONTACT,
            payload: id
          }))
        .then(res =>
          dispatch(
            returnSuccess('Deleted! Reloading the page ...', 200, 'DELETE_CONTACT'),
            // Reload after 4 seconds
            window.setTimeout(() => window.location.reload(), 4000)
          ))
    }

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'DELETE_CONTACT_FAIL'));
    dispatch({ type: DELETE_CONTACT_FAIL })
  }
}

// Get chat room messages - Get the room if it exists, if it doesn't, create it
export const getCreateRoom = (room1ON1ToGet) => async (dispatch, getState) => {
  await dispatch(setRoomLoading())

  try {
    await axiosInstance
      .post(`/api/chatrooms/rooms/room/${room1ON1ToGet.roomName}`, room1ON1ToGet, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_CREATE_CHAT_ROOM,
          payload: res.data
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_CREATE_CHAT_ROOM_FAIL'))
    dispatch({ type: GET_CREATE_CHAT_ROOM_FAIL })
  }
}

// Get chat room messages - Get the room if it exists, if it doesn't, create it
export const getRoomMessages = (roomID) => async (dispatch, getState) => {
  await dispatch(setRoomLoading())

  try {
    await axiosInstance
      .get(`/api/chatrooms/messages/room/${roomID}`, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: GET_ROOM_MESSAGES,
          payload: res.data
        }))
  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'GET_ROOM_MESSAGES_FAIL'))
    dispatch({ type: GET_ROOM_MESSAGES_FAIL })
  }
}

// Send messages to the room 
export const sendRoomMessage = (roomMessage) => async (dispatch, getState) => {

  try {
    await axiosInstance
      .post('/api/chatrooms/messages', roomMessage, tokenConfig(getState))
      .then(res =>
        dispatch({
          type: ADD_ROOMS_MESSAGE,
          payload: res.data
        }))
      .then(res =>
        dispatch(
          returnSuccess('Message sent!', 200, 'ADD_ROOMS_MESSAGE'),
          // Reload after 4 seconds
          // window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err && err.response && err.response.data, err && err.response && err.response.status, 'ADD_ROOMS_MESSAGE_FAIL'));
    dispatch({ type: ADD_ROOMS_MESSAGE_FAIL })
  }
};


export const setContactsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CONTACTS_LOADING

  }
}

export const setOneContactLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: ONE_CONTACT_LOADING

  }
}

export const setRoomLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: ROOM_LOADING

  }
}