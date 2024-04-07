import React, { useState, useEffect, useRef, useContext } from 'react'
import { Form, FormGroup, Button, Input } from 'reactstrap'
import { getRoomMessages, sendRoomMessage } from '../../redux/slices/contactsSlice'
import moment from 'moment'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { currentUserContext } from '../../appContexts'
import { useSelector, useDispatch } from "react-redux"
import { socket } from '../../utils/socket'

const RoomMessages = ({ oON1room, onlineList }) => {

    // Redux
    const contacts = useSelector(state => state.contacts)
    const { oneChatRoom, oneRoomMessages, isLoading } = contacts
    const dispatch = useDispatch()

    // Get current user from context
    const currentUser = useContext(currentUserContext)
    const lastMessageRef = useRef(null);
    const [welcomeMessage, setWelcomeMessage] = useState()
    const [roomMessageState, setRoomMessageState] = useState({
        message_content: '',
        message_sender: oON1room.senderID,
        message_receiver: oON1room.receiverID
    })

    const [typingStatus, setTypingStatus] = useState('');

    // Errors state on form
    const [setErrorsState] = useState([])

    // Typing state on form
    const handleTyping = () =>
        socket.emit('typing', `${currentUser && currentUser.name} is typing`);

    const sendMessage = e => {
        e.preventDefault()

        const { message_content, message_sender, message_receiver } = roomMessageState

        // VALIDATE
        if (!message_sender || !message_receiver || !oneChatRoom || message_content.length < 1) {
            setErrorsState(['Missing info!'])
            return
        }

        else if (message_content.length > 1000) {
            setErrorsState(['message is too long!'])
            return
        }

        // Create roomMessage object
        const roomMessage = {
            senderID: message_sender,
            receiverID: message_receiver,
            content: message_content,
            roomID: oneChatRoom && oneChatRoom._id
        }

        // Attempt to save to database
        dispatch(sendRoomMessage(roomMessage))

        // clear the messages state
        setRoomMessageState({ message_content: '' })
    }

    // runs whenever a the backend returns back the bRoomMsg received
    useEffect(() => {
        // Scroll to the bottom of the chat
        lastMessageRef.current.scrollTo({ top: 10, behavior: "smooth" })
        socket.on('typingResponse', (data) => setTypingStatus(data));
        socket.on('welcome_room_message', (data) => {
            console.log('welcome_room_message', data)
            setWelcomeMessage(data.message)
        })

        socket.on('backRoomMessage', bRoomMsg => {
            // Getting the updated messages with the new message
            console.log('backRoomMessage', bRoomMsg)
            oneChatRoom && oneChatRoom._id && dispatch(getRoomMessages(oneChatRoom._id))
        })

        return () => {
            socket.off('backRoomMessage')
            socket.off('typingResponse')
            socket.off('welcome_room_message')
        };
    }, [socket, oneChatRoom, dispatch])

    const matchingUsr = onlineList.find((user) => user.name === oON1room.receiverName);
    const onlineStatus = matchingUsr && matchingUsr.name === oON1room.receiverName ? '🟢' : '🔴'

    return (
        isLoading ? <QBLoadingSM title='chat messages' /> :

            <div className='h-100'>
                <h4
                    className='text-center py-2 py-lg-4 mt-5 mt-lg-3 fw-bolder border rounded'
                    style={{ backgroundColor: "burlywood", fontSize: ".9rem" }}>
                    {oON1room.receiverName}&nbsp;
                    <small style={{ fontSize: ".5rem", verticalAlign: "middle" }}>{onlineStatus}</small>
                </h4>
                <div ref={lastMessageRef} />
                {welcomeMessage !== '' &&
                    <div className='text-center mt-3 text-success'>
                        <small>{welcomeMessage}</small>
                    </div>}
                <div>
                    <p style={{ fontSize: ".65rem", color: "magenta" }}>{typingStatus}</p>
                </div>
                {/* CHAT BOX */}
                <Form className='w-100 m-1 mb-lg-5 d-flex flex-column align-center justify-center' onSubmit={sendMessage}>
                    <FormGroup className='flex-grow-1 w-100'>
                        <Input type='textarea' name='message_content' placeholder='Type your message here...' rows="5" onChange={e => setRoomMessageState({ ...roomMessageState, [e.target.name]: e.target.value })}
                            onKeyDown={handleTyping} value={roomMessageState.message_content} required />
                    </FormGroup>
                    <Button className='mx-auto w-50' style={{ height: "max-content", backgroundColor: "#157A6E" }}>
                        Send
                    </Button>
                </Form>

                <hr />
                {/* CHAT MESSAGES */}
                {
                    oneRoomMessages.length > 0 ?
                        oneRoomMessages && [...oneRoomMessages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((roomMsg, index) => (
                            <div key={index} className={`mt-2 mt-lg-5 ${roomMsg.sender === currentUser._id ? 'text-end' : 'text-start'}`}>
                                <div
                                    className={`bubble d-inline-block p-2 ${roomMsg.sender === currentUser._id ? 'ms-auto' : 'me-auto'}`}
                                    style={{
                                        backgroundColor: roomMsg.sender === currentUser._id ? '#f1f0f0' : '#6a89cc',
                                        color: roomMsg.sender === currentUser._id ? '' : 'white',
                                        borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem', fontWeight: '500', lineHeight: '1.2', verticalAlign: 'baseline', wordBreak: 'break-word'
                                    }}>
                                    {roomMsg.content}
                                </div>

                                <small className="text-info">
                                    <i className={`${roomMsg.sender === currentUser._id ? 'text-end' : 'text-start'} d-block mt-2`} style={{ fontSize: ".7rem", color: "#999" }}>
                                        {moment(new Date(roomMsg.createdAt)).format('YYYY-MM-DD, HH:mm')}
                                    </i>
                                </small>
                            </div>
                        )) :

                        <div className='text-center mt-3 text-success'>Start a new chat!</div>
                }
            </div>
    )
}

export default RoomMessages