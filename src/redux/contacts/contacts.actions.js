import { GET_CONTACTS, ADD_CONTACT, DELETE_CONTACT, ADD_CONTACT_FAIL, DELETE_CONTACT_FAIL, REPLY_CONTACT_FAIL, CONTACTS_LOADING, REPLY_CONTACT, GET_USER_CONTACTS, GET_USER_CONTACTS_FAIL } from "./contacts.types";
import axios from 'axios';
import { tokenConfig } from '../auth/auth.actions'
import { returnErrors } from "../error/error.actions";
import { returnSuccess } from '../success/success.actions'
import { apiURL } from '../config'

// Axios instance
const axiosInstance = axios.create({
  baseURL: apiURL,
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
    dispatch(returnErrors(err.response.data, err.response.status))
  }
};

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
    dispatch(returnErrors(err.response.data, err.response.status, 'GET_USER_CONTACTS_FAIL'))
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
          returnSuccess('Message sent! Reloading the page ...', 200, 'ADD_CONTACT'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'ADD_CONTACT_FAIL'));
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
          returnSuccess('Reply sent! Reloading the page ...', 200, 'REPLY_CONTACT'),
          // Reload after 4 seconds
          window.setTimeout(() => window.location.reload(), 4000)
        ))

  } catch (err) {
    dispatch(returnErrors(err.response.data, err.response.status, 'REPLY_CONTACT_FAIL'));
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
    dispatch(returnErrors(err.response.data, err.response.status, 'DELETE_CONTACT_FAIL'));
    dispatch({ type: DELETE_CONTACT_FAIL })
  }
}

export const setContactsLoading = () => {
  //Return an action to the reducer
  return {
    //action 
    type: CONTACTS_LOADING

  }
}