import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiCallHelper, handlePending, handleRejected } from '../configHelpers';
import { notify } from '@/utils/notifyToast';

// Async actions with createAsyncThunk
export const getContacts = createAsyncThunk('contacts/getContacts', async (pageNo, { getState }) =>
  apiCallHelper(`/api/contacts?pageNo=${pageNo}`, 'get', null, getState, 'getContacts'));

export const getOneContact = createAsyncThunk('contacts/getOneContact', async (contactId, { getState }) =>
  apiCallHelper(`/api/contacts/${contactId}`, 'get', null, getState, 'getOneContact'));

export const getUserContacts = createAsyncThunk('contacts/getUserContacts', async (userEmail, { getState }) =>
  apiCallHelper(`/api/contacts/sender/${userEmail}`, 'get', null, getState, 'getUserContacts'));

export const sendContactMessage = createAsyncThunk('contacts/sendContactMessage', async (contactMsg, { getState }) =>
  apiCallHelper('/api/contacts', 'post', contactMsg, getState, 'sendContactMessage'));

export const addContactReply = createAsyncThunk('contacts/addContactReply', async ({ idToUpdate, reply }, { getState }) =>
  apiCallHelper(`/api/contacts/${idToUpdate}`, 'put', reply, getState, 'addContactReply'));

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (contactID, { getState }) =>
  apiCallHelper(`/api/contacts/${contactID}`, 'delete', null, getState, 'deleteContact'));

// Chat rooms
export const getChatRooms = createAsyncThunk('chatRgetChatRooms/getChatRooms', async (pageNo, { getState }) =>
  apiCallHelper(`/api/chat-rooms?pageNo=${pageNo}`, 'get', null, getState, 'getChatRooms'));

export const getUserChatRooms = createAsyncThunk('contacts/getUserChatRooms', async (payload, { getState }) =>
  apiCallHelper(`/api/chat-rooms/user/${payload._id}?pageNo=${payload.pageNo}`, 'get', null, getState, 'getUserChatRooms'));

export const getCreateRoom = createAsyncThunk('contacts/getCreateRoom', async (oneOnOneRoom, { getState }) =>
  apiCallHelper(`/api/chat-rooms/room/${oneOnOneRoom.roomName}`, 'post', oneOnOneRoom, getState, 'getCreateRoom'));

export const getRoomMessages = createAsyncThunk('contacts/getRoomMessages', async (roomID, { getState }) =>
  apiCallHelper(`/api/room-messages/room/${roomID}`, 'get', null, getState, 'getRoomMessages'));

export const getBatchedRoomMessages = createAsyncThunk('contacts/getBatchedRoomMessages', async (roomIds, { getState }) =>
  apiCallHelper(`/api/room-messages/batched`, 'post', { roomIds }, getState, 'getBatchedRoomMessages'));

export const sendRoomMessage = createAsyncThunk('contacts/sendRoomMessage', async (roomMessage, { getState }) =>
  apiCallHelper('/api/room-messages', 'post', roomMessage, getState, 'sendRoomMessage'));

export const deleteChatroom = createAsyncThunk('contacts/deleteChatroom', async (roomID, { getState }) =>
  apiCallHelper(`/api/chat-rooms/${roomID}`, 'delete', null, getState, 'deleteChatroom'));


// Contacts slice
const initialState = {
  allContacts: [],
  userContacts: [],
  oneContact: null,
  userChatRooms: [],
  userChatRoomsPages: 0,
  allChatRooms: [],
  allChatRoomsPages: 0,
  oneChatRoom: null,
  oneRoomMessages: [],
  batchedRoomMessages: {}, // { roomId: [messages], roomId2: [messages], ... }
  reply: null,
  isLoading: false,
  error: null
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    clearContacts: state => {
      state.allContacts = [];
      state.userContacts = [];
      state.oneContact = null;
      state.userChatRoomsPages = 0;
      state.allChatRoomsPages = 0;
      state.allChatRooms = [];
      state.userChatRooms = [];
      state.oneChatRoom = null;
      state.oneRoomMessages = [];
      state.batchedRoomMessages = {};
      state.reply = null;
      state.isLoading = false;
    },
    pushRoomMessage: (state, action) => {

      console.log('Redux pushRoomMessage action payload:', action.payload);
      const { roomID, message } = action.payload;
      // Update both stores
      state.oneRoomMessages.push(message);
      if (state.batchedRoomMessages[roomID]) {
        state.batchedRoomMessages[roomID].push(message);
      }
    },
    clearRoomMessages: (state) => {
      state.oneRoomMessages = [];
    },
    clearAllChatRooms: (state) => {
      state.allChatRooms = [];
    },
    clearUserChatRooms: (state) => {
      state.userChatRooms = [];
    },
  },
  extraReducers: (builder) => {

    // Fullfilled actions
    builder.addCase(getContacts.fulfilled, (state, action) => {
      state.allContacts = action.payload.contacts;
      state.totalPages = action.payload.totalPages;
      state.isLoading = false;
    });
    builder.addCase(getOneContact.fulfilled, (state, action) => {
      state.oneContact = action.payload;
      state.isLoading = false;
    });
    builder.addCase(getUserContacts.fulfilled, (state, action) => {
      state.userContacts = action.payload;
      state.isLoading = false;
    });
    builder.addCase(sendContactMessage.fulfilled, (state, action) => {
      state.allContacts.unshift(action.payload);
      state.isLoading = false;
    });
    builder.addCase(addContactReply.fulfilled, (state, action) => {
      state.oneContact = action.payload;
      state.allContacts = state.allContacts.map(contact =>
        contact._id === action.payload._id ? action.payload : contact
      );
      state.userContacts = state.userContacts.map(contact =>
        contact._id === action.payload._id ? action.payload : contact
      );
      state.reply = action.payload.replies.slice(-1)[0];
      state.isLoading = false;
    });
    builder.addCase(deleteContact.fulfilled, (state, action) => {
      state.allContacts = state.allContacts.filter(contact => contact._id !== action.payload._id);
      state.isLoading = false;
      notify('Contact deleted', 'success');
    });

    // Chat rooms
    builder.addCase(getChatRooms.fulfilled, (state, action) => {
      state.allChatRooms = action.payload.chatRooms;
      state.allChatRoomsPages = action.payload.totalPages;
      state.isLoading = false;
    });
    builder.addCase(getUserChatRooms.fulfilled, (state, action) => {
      state.userChatRooms = action.payload.chatRooms;
      state.userChatRoomsPages = action.payload.totalPages;
      state.isLoading = false;
    });
    builder.addCase(getCreateRoom.fulfilled, (state, action) => {
      state.oneChatRoom = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getRoomMessages.fulfilled, (state, action) => {
      state.oneRoomMessages = action.payload;
      state.isLoading = false;
    });

    builder.addCase(getBatchedRoomMessages.fulfilled, (state, action) => {
      const messages = action.payload;

      const updatedMessages = {};

      for (const msg of messages) {
        if (!updatedMessages[msg.room]) {
          updatedMessages[msg.room] = [];
        }
        updatedMessages[msg.room].unshift(msg);
      }

      // Replace the entire room messages
      state.batchedRoomMessages = updatedMessages;
      state.isLoading = false;
    });

    builder.addCase(sendRoomMessage.fulfilled, (state, action) => {
      const message = action.payload;
      const roomID = message.room;

      // Update both stores
      state.oneRoomMessages.push(message);
      if (!state.batchedRoomMessages[roomID]) {
        state.batchedRoomMessages[roomID] = [];
      }
      state.batchedRoomMessages[roomID].unshift(message);
      state.isLoading = false;
    });

    builder.addCase(deleteChatroom.fulfilled, (state, action) => {
      state.allChatRooms = state.allChatRooms.filter(room => room._id !== action.payload._id);
      state.userChatRooms = state.userChatRooms.filter(room => room._id !== action.payload._id);
      state.isLoading = false;
    });

    // Pending actions
    builder.addCase(getContacts.pending, handlePending);
    builder.addCase(getOneContact.pending, handlePending);
    builder.addCase(getUserContacts.pending, handlePending);
    builder.addCase(sendContactMessage.pending, handlePending);
    builder.addCase(addContactReply.pending, handlePending);
    builder.addCase(deleteContact.pending, handlePending);

    // Chat rooms
    builder.addCase(getChatRooms.pending, handlePending);
    builder.addCase(getUserChatRooms.pending, handlePending);
    builder.addCase(getCreateRoom.pending, handlePending);
    builder.addCase(getRoomMessages.pending, handlePending);
    builder.addCase(getBatchedRoomMessages.pending, handlePending);
    builder.addCase(sendRoomMessage.pending, handlePending);
    builder.addCase(deleteChatroom.pending, handlePending);

    // Rejected actions
    builder.addCase(getContacts.rejected, handleRejected);
    builder.addCase(getOneContact.rejected, handleRejected);
    builder.addCase(getUserContacts.rejected, handleRejected);
    builder.addCase(sendContactMessage.rejected, handleRejected);
    builder.addCase(addContactReply.rejected, handleRejected);
    builder.addCase(deleteContact.rejected, handleRejected);

    // Chat rooms
    builder.addCase(getChatRooms.rejected, handleRejected);
    builder.addCase(getUserChatRooms.rejected, handleRejected);
    builder.addCase(getCreateRoom.rejected, handleRejected);
    builder.addCase(getRoomMessages.rejected, handleRejected);
    builder.addCase(getBatchedRoomMessages.rejected, handleRejected);
    builder.addCase(sendRoomMessage.rejected, handleRejected);
    builder.addCase(deleteChatroom.rejected, handleRejected);
  }
});

export const { clearContacts, pushRoomMessage, clearRoomMessages, clearUserChatRooms, clearAllChatRooms } = contactsSlice.actions;
export default contactsSlice.reducer;
