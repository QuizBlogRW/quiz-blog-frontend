import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react';
import { Button, Col } from 'reactstrap';
import { useSelector, useDispatch } from 'react-redux';
import { pushRoomMessage, sendRoomMessage, getCreateRoom } from '@/redux/slices/contactsSlice';
import { notify } from '@/utils/notifyToast';
import { socketEmit, socketOn, socketOff } from '@/utils/socket';
import { useTypingIndicator } from '@/hooks/useTypingIndicator';
import SelectChat from "@/components/dashboard/utils/SelectChat";
import MessagesContainer from '../MessagesContainer';
import MessageInputForm from './MessageInputForm';

const MAX_MESSAGE_LENGTH = 1000;

// Message bubble component for better performance
const MessageBubble = memo(({ message, isMe, formattedDate }) => {
    const bubbleStyle = useMemo(() => ({
        backgroundColor: isMe ? '#f1f0f0' : '#6a89cc',
        color: isMe ? '#333' : '#fff',
        borderRadius: '10px',
        maxWidth: '80%',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.4',
        wordBreak: 'break-word',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    }), [isMe]);

    const containerClass = useMemo(
        () => `d-flex flex-column ${isMe ? 'align-items-end' : 'align-items-start'} mb-3`,
        [isMe]
    );

    return (
        <div className={containerClass}>
            <div className="bubble p-2 px-3" style={bubbleStyle}>
                {message.content}
            </div>
            {formattedDate && (
                <small className="text-muted mt-1" style={{ fontSize: '0.7rem' }}>
                    <time dateTime={message.createdAt}>
                        {formattedDate}
                    </time>
                </small>
            )}
        </div>
    );
});

MessageBubble.displayName = 'MessageBubble';

const RoomMessages = ({ roomOpen, room, onlineList, onClose, showAllChats, isTemporary, onRoomCreated }) => {

    const dispatch = useDispatch();
    const existingRoom = useSelector(state => state.contacts.oneChatRoom);
    const oneRoomMessages = useSelector(state => state.contacts.oneRoomMessages);
    const isLoading = useSelector(state => state.contacts.isLoading);
    const user = useSelector(state => state.users.user);

    const textareaRef = useRef(null);
    const messageRef = useRef('');

    const [welcomeMessage, setWelcomeMessage] = useState('');
    const [messageContent, setMessageContent] = useState('');

    // Typing indicator hook
    const { typingUsers, handleTyping } = useTypingIndicator(
        existingRoom?._id,
        { id: user?._id, name: user?.name }
    );

    // Check if receiver is online
    const isReceiverOnline = useMemo(
        () => onlineList?.some(u => u._id === room?.receiver),
        [onlineList, room?.receiver]
    );

    const onlineStatus = useMemo(() => ({
        indicator: isReceiverOnline ? '🟢' : '🔴',
        text: isReceiverOnline ? 'Online' : 'Offline'
    }), [isReceiverOnline]);

    /* ------------------ SEND MESSAGE ------------------ */

    const [isCreatingRoom, setIsCreatingRoom] = useState(false);
    const sendChatMessage = useCallback((e) => {
        e.preventDefault();

        if (isCreatingRoom) return; // Prevent duplicate requests
        const trimmedMessage = messageContent.trim();

        // Validation
        if (!trimmedMessage) {
            notify('Please enter a message', 'error');
            return;
        }

        if (!room?.sender || !room?.receiver) {
            notify('Missing sender or receiver information', 'error');
            return;
        }

        if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
            notify(`Message is too long! Maximum ${MAX_MESSAGE_LENGTH} characters.`, 'error');
            return;
        }

        // If we are in a temporary room, create it first
        if (isTemporary) {
            setIsCreatingRoom(true);
            dispatch(getCreateRoom({
                roomName: room?.roomName,
                sender: room.sender,
                receiver: room.receiver,
                receiverName: room.receiverName,
            }))
            .unwrap()
            .then((res) => {

                // Dispatch action to send message to room
                if (res) {
                    const roomMessage = {
                        sender: room.sender,
                        receiver: room.receiver,
                        content: trimmedMessage,
                        roomID: res.payload._id,
                        roomName: room?.roomName,
                    };

                    dispatch(sendRoomMessage(roomMessage)).then(() => {
                        socketEmit("roomMessage", roomMessage);
                    })
                }
                onRoomCreated && onRoomCreated();
            }).catch((error) => {
                notify('Failed to create room', 'error');
                console.error(error);
            })
                .finally(() => {
                    setIsCreatingRoom(false);
                });
        } else {
            // Send message to existing room
            const roomMessage = {
                sender: room.sender,
                receiver: room.receiver,
                content: trimmedMessage,
                roomID: existingRoom?._id,
                roomName: existingRoom?.name,
            };

            dispatch(sendRoomMessage(roomMessage)).then(() => {
                socketEmit("roomMessage", roomMessage);
            })
        }

        // Clear input
        setMessageContent('');
        messageRef.current = '';

        existingRoom && socketEmit('stopTyping', {
            roomID: existingRoom?._id,
            user: { id: user._id, name: user.name }
        });

        // Focus back on textarea
        textareaRef.current?.focus();
    }, [messageContent, room, existingRoom, dispatch, user, isCreatingRoom]);

    /* ------------------ SOCKET LISTENERS ------------------ */
    const handleNewMessage = useCallback((newMessage) => {
        if (!existingRoom?._id) return;

        if (newMessage.roomID !== existingRoom?._id) {
            return;
        }

        dispatch(pushRoomMessage({
            roomID: existingRoom?._id,
            message: newMessage,
        }));
    }, [existingRoom?._id, dispatch]);

    const handleUserJoined = useCallback((data) => {
        setWelcomeMessage(data.message || '');
    }, []);

    useEffect(() => {
        if (!welcomeMessage) return;

        const id = setTimeout(() => setWelcomeMessage(''), 3000);
        return () => clearTimeout(id);
    }, [welcomeMessage]);

    useEffect(() => {
        if (!existingRoom?._id) return;

        socketOn('userJoinedRoom', handleUserJoined);
        socketOn('newMessage', handleNewMessage);

        return () => {
            socketOff('newMessage', handleNewMessage);
            socketOff('userJoinedRoom', handleUserJoined);
        };

    }, [existingRoom?._id, handleNewMessage]);

    /* ------------------ KEYBOARD SHORTCUTS ------------------ */
    useEffect(() => {
        messageRef.current = messageContent;
    }, [messageContent]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                if (messageRef.current.trim()) {
                    sendChatMessage(e);
                }
            }
        };

        const textarea = textareaRef.current;
        textarea?.addEventListener('keydown', handleKeyDown);
        return () => textarea?.removeEventListener('keydown', handleKeyDown);
    }, [sendChatMessage]);

    if (!room) return <SelectChat message="Select a contact to start chatting" />;

    return (
        <Col
            xs="12"
            sm="6"
            className="d-flex flex-column overflow-auto bg-white rounded p-2"
            style={{ maxHeight: '100vh' }}
        >

            {roomOpen && room ?
                <div className="d-flex flex-column h-100">
                    {/* Header */}
                    <div className="border-bottom pb-2 mb-3 d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                            <h6 className="mb-1">
                                {room?.receiverName}
                                <span
                                    className="ms-2"
                                    title={onlineStatus.text}
                                    aria-label={onlineStatus.text}
                                    style={{ fontSize: '0.75rem' }}
                                >
                                    {onlineStatus.indicator}
                                </span>
                            </h6>
                            <small className="text-muted">{onlineStatus.text}</small>
                        </div>
                        {onClose && (
                            <Button
                                close
                                onClick={onClose}
                                aria-label="Close chat"
                            />
                        )}
                    </div>

                    {/* Welcome Message */}
                    {welcomeMessage && (
                        <div
                            className="alert alert-success text-center py-2 mb-3"
                            role="status"
                            style={{ fontSize: '0.875rem' }}
                        >
                            {welcomeMessage}
                        </div>
                    )}

                    {/* Messages Container */}
                    <MessagesContainer
                        isArchive={false}
                        messages={oneRoomMessages}
                        typingUsers={typingUsers}
                    />

                    {/* Input Form */}
                    <MessageInputForm
                        textareaRef={textareaRef}
                        messageContent={messageContent}
                        setMessageContent={setMessageContent}
                        sendChatMessage={sendChatMessage}
                        handleTyping={handleTyping}
                        isLoading={isLoading}
                        showAllChats={showAllChats}
                    />
                </div> : <SelectChat message="Select a chat or an online contact to start chatting" />}
        </Col>
    );
};

export default memo(RoomMessages);
