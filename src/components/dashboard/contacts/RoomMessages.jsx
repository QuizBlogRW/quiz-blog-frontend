import moment from 'moment';
import { useState, useEffect, useRef } from 'react';
import { Form, FormGroup, Button, Input } from 'reactstrap';
import { getRoomMessages, sendRoomMessage } from '@/redux/slices/contactsSlice';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { useSelector, useDispatch } from 'react-redux';
import { socket } from '@/utils/socket';
import { notify } from '@/utils/notifyToast';
const RoomMessages = ({ oON1room, onlineList }) => {

    // Redux
    const contacts = useSelector(state => state.contacts);
    const { oneChatRoom, oneRoomMessages, isLoading } = contacts;
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const lastMessageRef = useRef(null);
    const [welcomeMessage, setWelcomeMessage] = useState();
    const [roomMessageState, setRoomMessageState] = useState({
        message_content: '',
        message_sender: oON1room.senderID,
        message_receiver: oON1room.receiverID
    });

    const [typingStatus, setTypingStatus] = useState('');

    // Typing state on form
    const handleTyping = () => {
        if (socket) socket.emit('typing', `${user && user.name} is typing`);
    }

    const sendMessage = e => {
        e.preventDefault();

        const { message_content, message_sender, message_receiver } = roomMessageState;

        // VALIDATE
        if (!message_sender || !message_receiver || !oneChatRoom || message_content.length < 1) {
            notify('Missing info!', 'error');
            return;
        }

        else if (message_content.length > 1000) {
            notify('message is too long!', 'error');
            return;
        }

        // Create roomMessage object
        const roomMessage = {
            senderID: message_sender,
            receiverID: message_receiver,
            content: message_content,
            roomID: oneChatRoom && oneChatRoom._id,
            senderName: user.name,
        };

        // Attempt to save to database
        dispatch(sendRoomMessage(roomMessage));

        // clear the messages state
        setRoomMessageState({ message_content: '' });
    };

    // runs whenever a the backend returns back the bRoomMsg received
    useEffect(() => {
        if (!socket) return;

        socket.on('typingResponse', (data) => setTypingStatus(data));
        socket.on('welcome_room_message', (data) => {
            setWelcomeMessage(data.message);
        });

        socket.on('backRoomMessage', bRoomMsg => {

            // Getting the updated messages with the new message
            oneChatRoom && oneChatRoom._id && dispatch(getRoomMessages(oneChatRoom._id));

            // Notify the user of the new message
            if (bRoomMsg.senderName !== user.name) {
                notify(`New message from ${bRoomMsg.senderName}!`);
            }
        });

        return () => {
            socket.off('backRoomMessage');
            socket.off('typingResponse');
            socket.off('welcome_room_message');
        };
    }, [socket, oneChatRoom, dispatch]);

    useEffect(() => {
        // scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [oneRoomMessages]);

    const matchingUsr = onlineList.find((user) => user.name === oON1room.receiverName);
    const onlineStatus = matchingUsr && matchingUsr.name === oON1room.receiverName ? '🟢' : '🔴';

    return (
        isLoading ? <QBLoadingSM title='chat messages' /> :

            <div className='h-100'>
                <h4
                    className='text-center py-2 py-lg-4 mt-5 mt-lg-3 fw-bolder border rounded'
                    style={{ backgroundColor: 'burlywood', fontSize: '.9rem' }}>
                    {oON1room.receiverName}&nbsp;
                    <small style={{ fontSize: '.5rem', verticalAlign: 'middle' }}>{onlineStatus}</small>
                </h4>
                {welcomeMessage !== '' &&
                    <div className='text-center mt-3 text-success'>
                        <small>{welcomeMessage}</small>
                    </div>}
                <div>
                    <p style={{ fontSize: '.65rem', color: 'magenta' }}>{typingStatus}</p>
                </div>
                <hr />
                {/* CHAT MESSAGES */}
                {
                    oneRoomMessages.length > 0 ?
                        oneRoomMessages.map((roomMsg, index) => {

                            const { sender, content, createdAt } = roomMsg;
                            const formattedDate = moment(new Date(createdAt)).format('DD MMM YYYY, HH:mm');

                            return (
                                <div key={index} className={`mt-2 mt-lg-5 ${sender === user._id ? 'text-end' : 'text-start'}`}>
                                    <div
                                        className={`bubble d-inline-block p-2 ${sender === user._id ? 'ms-auto' : 'me-auto'}`}
                                        style={{
                                            backgroundColor: sender === user._id ? '#f1f0f0' : '#6a89cc',
                                            color: sender === user._id ? '' : 'white',
                                            borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem', fontWeight: '500', lineHeight: '1.2', verticalAlign: 'baseline', wordBreak: 'break-word'
                                        }}>
                                        {content}
                                    </div>

                                    <small className="text-info">
                                        <i className={`${sender === user._id ? 'text-end' : 'text-start'} d-block mt-2`} style={{ fontSize: '.7rem', color: '#999' }}>
                                            {formattedDate === 'Invalid date' ? '' : formattedDate}
                                        </i>
                                    </small>
                                </div>
                            )
                        }) :

                        <div className='text-center mt-3 text-success'>Start a new chat!</div>
                }

                <hr />

                {/* CHAT BOX */}
                <Form className='w-100 m-1 pb-3 mb-lg-5 d-flex flex-column align-center justify-center' onSubmit={sendMessage}>
                    <FormGroup className='flex-grow-1 w-100'>
                        <Input type='textarea' name='message_content' placeholder='Type your message here...' rows="5" onChange={e => setRoomMessageState({ ...roomMessageState, [e.target.name]: e.target.value })}
                            onKeyDown={handleTyping} value={roomMessageState.message_content} required />
                    </FormGroup>
                    <Button className='mx-auto w-50' style={{ height: 'max-content', backgroundColor: 'var(--brand)' }}>
                        Send
                    </Button>
                    <div ref={lastMessageRef} />
                </Form>
            </div>
    );
};

export default RoomMessages;
