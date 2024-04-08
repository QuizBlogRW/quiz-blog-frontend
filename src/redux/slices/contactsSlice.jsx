import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiCallHelper } from '../configHelpers'
import { socket } from '../../utils/socket'
import { notify } from '../../utils/notifyToast'

// Async actions with createAsyncThunk
export const getContacts = createAsyncThunk("contacts/getContacts", async (pageNo, { getState, dispatch }) =>
  apiCallHelper(`/api/contacts?pageNo=${pageNo}`, 'get', null, getState, dispatch, 'getContacts'))

export const getOneContact = createAsyncThunk("contacts/getOneContact", async (contactId, { getState, dispatch }) =>
  apiCallHelper(`/api/contacts/${contactId}`, 'get', null, getState, dispatch, 'getOneContact'))

export const getUserContacts = createAsyncThunk("contacts/getUserContacts", async (userEmail, { getState, dispatch }) =>
  apiCallHelper(`/api/contacts/sent-by/${userEmail}`, 'get', null, getState, dispatch, 'getUserContacts'))

export const sendMsg = createAsyncThunk("contacts/sendMsg", async (contactMsg, { getState, dispatch }) =>
  apiCallHelper('/api/contacts', 'post', contactMsg, getState, dispatch, 'sendMsg'))

export const replyContact = createAsyncThunk("contacts/replyContact", async ({ idToUpdate, reply }, { getState, dispatch }) =>
  apiCallHelper(`/api/contacts/${idToUpdate}`, 'put', reply, getState, dispatch, 'replyContact'))

export const deleteContact = createAsyncThunk("contacts/deleteContact", async (contactID, { getState, dispatch }) =>
  apiCallHelper(`/api/contacts/${contactID}`, 'delete', null, getState, dispatch, 'deleteContact'))

export const getCreateRoom = createAsyncThunk("contacts/getCreateRoom", async (oON1room, { getState, dispatch }) =>
  apiCallHelper(`/api/chatrooms/rooms/room/${oON1room.roomName}`, 'post', oON1room, getState, dispatch, 'getCreateRoom'))

export const getRoomMessages = createAsyncThunk("contacts/getRoomMessages", async (roomID, { getState, dispatch }) =>
  apiCallHelper(`/api/chatrooms/messages/room/${roomID}`, 'get', null, getState, dispatch, 'getRoomMessages'))

export const sendRoomMessage = createAsyncThunk("contacts/sendRoomMessage", async (roomMessage, { getState, dispatch }) =>
  apiCallHelper('/api/chatrooms/messages', 'post', roomMessage, getState, dispatch, 'sendRoomMessage'))


// Contacts slice
const initialState = {
  allContacts: [],
  userContacts: [],
  oneContact: null,
  totalPages: 0,
  oneChatRoom: null,
  oneRoomMessages: [],
  reply: null,
  isLoading: false
}

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearContacts: state => {
      state.allContacts = []
      state.userContacts = []
      state.oneContact = null
      state.totalPages = 0
      state.oneChatRoom = null
      state.oneRoomMessages = []
      state.reply = null
      state.isLoading = false
    }
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.allContacts = action.payload.contacts
      state.totalPages = action.payload.totalPages
      state.isLoading = false
    })
    builder.addCase(getOneContact.fulfilled, (state, action) => {
      state.oneContact = action.payload
      state.isLoading = false
    })
    builder.addCase(getUserContacts.fulfilled, (state, action) => {
      state.userContacts = action.payload
      state.isLoading = false
    })
    builder.addCase(sendMsg.fulfilled, (state, action) => {
      state.allContacts.push(action.payload)
      state.isLoading = false
    })
    builder.addCase(replyContact.fulfilled, (state, action) => {
      state.reply = action.payload
      state.isLoading = false
      socket.emit('newReply', action.payload)
    })
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.allContacts = state.allContacts.filter(contact => contact._id !== action.payload)
      state.isLoading = false
      notify('Contact deleted', 'success')
    })
    builder.addCase(getCreateRoom.fulfilled, (state, action) => {
      state.oneChatRoom = action.payload
      state.isLoading = false
    })
    builder.addCase(getRoomMessages.fulfilled, (state, action) => {
      state.oneRoomMessages = action.payload
      state.isLoading = false
    })
    builder.addCase(sendRoomMessage.fulfilled, (state, action) => {
      state.oneRoomMessages.push(action.payload)
      state.isLoading = false
      socket.emit('room_message', action.payload)
    })

    // Pending actions
    builder.addCase(getContacts.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getOneContact.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getUserContacts.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(sendMsg.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(replyContact.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(deleteContact.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getCreateRoom.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(getRoomMessages.pending, (state, action) => {
      state.isLoading = true
    })
    builder.addCase(sendRoomMessage.pending, (state, action) => {
      state.isLoading = true
    })

    // Rejected actions
    builder.addCase(getContacts.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getOneContact.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getUserContacts.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(sendMsg.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(replyContact.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(deleteContact.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getCreateRoom.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(getRoomMessages.rejected, (state, action) => {
      state.isLoading = false
    })
    builder.addCase(sendRoomMessage.rejected, (state, action) => {
      state.isLoading = false
    })

  }
})

export const { clearContacts } = contactsSlice.actions
export default contactsSlice.reducer