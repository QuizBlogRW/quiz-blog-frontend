// ============================================
// ChatsPanel.jsx - Using GenericPanel for Chats
// ============================================
import { memo, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteChatroom } from '@/redux/slices/contactsSlice';
import QBLoadingSM from "@/utils/rLoading/QBLoadingSM";
import GenericPanel from '../GenericPanel';
import { notify } from '@/utils/notifyToast';

const ChatsPanel = ({ chatRooms, openRoom }) => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.users.user);
    const isLoading = useSelector(state => state.contacts.isLoading);
    const batchedRoomMessages = useSelector(state => state.contacts.batchedRoomMessages);

    const isAdmin = useMemo(() => user?.role?.includes('Admin'), [user?.role]);
    const userId = user?._id;

    const handleDelete = roomId => {
        dispatch(deleteChatroom(roomId))
            .unwrap()
            .then(() => notify('Chatroom deleted', 'success'));
    };

    const getRoomPreview = useCallback((roomId) => {
        const messages = batchedRoomMessages[roomId] || [];
        if (!messages.length) return { count: 0, latestRoomMessage: '' };

        const latest = messages.reduce((acc, curr) =>
            !acc || new Date(curr.createdAt) > new Date(acc.createdAt) ? curr : acc
            , null);

        return {
            count: messages.length,
            latestRoomMessage: latest?.content || ''
        };
    }, [batchedRoomMessages]);

    // Configuration for chat rooms
    const config = {
        getTitle: (room) => {
            const otherUser = room.users.find(u => u._id !== userId) || {};
            return otherUser?.name || 'Unknown';
        },
        getSubtitle: (room) => {
            const otherUser = room.users.find(u => u._id !== userId) || {};
            return otherUser?.email || '';
        },
        getMessage: (room) => {
            const preview = getRoomPreview(room._id);
            return preview.latestRoomMessage;
        },
        getDate: (room) => room.createdAt,
        getPreview: (room) => {
            const { count, latestRoomMessage } = getRoomPreview(room._id);
            return { count, latestRoomMessage, currentUserId: userId };
        },
        getAriaLabel: (room) => {
            const otherUser = room.users.find(u => u._id !== userId) || {};
            return `Chat with ${otherUser?.name}`;
        },
        getCountLabel: (count) => `${count} unread messages`,
        LoadingComponent: QBLoadingSM
    };

    const actions = {
        onClick: (room, preview) => {

            const otherUser = room.users.find(u => u._id !== preview?.currentUserId) || {};

            openRoom({
                roomName: room.name,
                sender: preview?.currentUserId,
                receiver: otherUser._id,
                receiverName: otherUser.name,
            });
        },
        onDelete: handleDelete
    };

    const emptyLink = user?.role !== 'Visitor' ? null : {
        to: '/contact',
        text: 'Start a new chat or chat with online users!',
        label: 'Start new chat'
    };

    return (
        <GenericPanel
            items={chatRooms}
            config={config}
            actions={actions}
            permissions={{ showDelete: isAdmin }}
            loading={isLoading}
            emptyMessage={user?.role !== 'Visitor' ? 'No rooms yet!' : null}
            emptyLink={emptyLink}
        />
    );
};

export default memo(ChatsPanel);
