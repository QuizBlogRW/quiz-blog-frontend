import React, { useState, useEffect, useRef, useContext } from 'react'
import { Form, FormGroup, Button, Input } from 'reactstrap'
import { connect } from 'react-redux'
import { getCreateRoom, getRoomMessages, sendRoomMessage } from '../../../redux/contacts/contacts.actions'
import moment from 'moment'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { currentUserContext } from '../../../appContexts'

const RoomChatComponent = ({ socket, onlineList, room1ON1ToGet, chatRoom, roomMessages, getCreateRoom, getRoomMessages, sendRoomMessage, clearErrors, clearSuccess }) => {

    // Get current user from context
    const currentUser = useContext(currentUserContext)

    const roomID = chatRoom && chatRoom.oneChatRoom && chatRoom.oneChatRoom._id
    const roomMsgesss = roomMessages && roomMessages.oneRoomMessages
    const lastMessageRef = useRef(null);
    const [welcomeMessage, setWelcomeMessage] = useState()

    useEffect(() => {
        // scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [roomMsgesss]);

    // Get create room from the room1ON1ToGet passed in from ContactChatCard component 
    useEffect(() => {
        getCreateRoom({ roomName: room1ON1ToGet.roomName, users: [room1ON1ToGet.sender, room1ON1ToGet.receiver] })
        roomID && getRoomMessages(roomID)
    }, [getCreateRoom, room1ON1ToGet, getRoomMessages, roomID])

    const [roomMessageState, setRoomMessageState] = useState({
        message_content: '',
        message_sender: room1ON1ToGet.sender,
        message_receiver: room1ON1ToGet.receiver
    })

    const [roomIDState, setRoomIDState] = useState()

    useEffect(() => { setRoomIDState(roomID && roomID) }, [roomID])

    const [typingStatus, setTypingStatus] = useState('');

    // Alert
    // const [visible, setVisible] = useState(true)
    // const onDismiss = () => setVisible(false)

    // Errors state on form
    const [setErrorsState] = useState([])

    // Typing state on form
    const handleTyping = () =>
        socket.emit('typing', `${currentUser && currentUser.name} is typing`);

    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
    }, [socket]);


    const onChangeHandler = e => {
        clearErrors()
        clearSuccess()
        setRoomMessageState({ ...roomMessageState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { message_content, message_sender, message_receiver } = roomMessageState

        // VALIDATE
        if (!message_sender || !message_receiver || !roomIDState || message_content.length < 1) {
            setErrorsState(['Missing info!'])
            return
        }

        else if (message_content.length > 1000) {
            setErrorsState(['message is too long!'])
            return
        }

        // Create roomMessage object
        const roomMessage = {
            sender: message_sender,
            receiver: message_receiver,
            content: message_content,
            room: roomIDState
        }

        // Attempt to save to database
        sendRoomMessage(roomMessage)

        // join and send room_message to server
        socket.emit('room_message', roomMessage.content)

        // clear the messages state
        setRoomMessageState({ message_content: '' })
    }

    // runs whenever a the backend returns back the bRoomMsg received
    useEffect(() => {
        socket.on('welcome_room_message', (data) => {
            setWelcomeMessage(data.message)
        })

        socket.on('backRoomMessage', bRoomMsg => {
            // Getting the updated messages with the new message
            roomID && getRoomMessages(roomID)
            console.log('backRoomMessage', bRoomMsg)
        })
    }, [socket, getRoomMessages, roomID])

    const matchingUsr = onlineList.find((user) => user.username === room1ON1ToGet.whoToChat);
    const status = matchingUsr && matchingUsr.username === room1ON1ToGet.whoToChat ? '🟢' : '🔴'

    return (
        roomMessages.isRoomLoading ? <SpinningBubbles title='chat messages' /> :

            <div className='h-100'>
                <h4
                    className='text-center py-2 py-lg-4 mt-5 mt-lg-3 font-weight-bold border rounded'
                    style={{ backgroundColor: "burlywood", fontSize: ".9rem" }}>
                    {room1ON1ToGet.whoToChat}&nbsp;
                    <small style={{ fontSize: ".5rem", verticalAlign: "middle" }}>{status}</small>
                </h4>
                <hr />

                {welcomeMessage !== '' &&
                    <div className='text-center mt-3 text-success'>
                        <small>{welcomeMessage}</small>
                    </div>}

                {/* CHAT MESSAGES */}
                {
                    roomMsgesss.length > 0 ?
                        roomMsgesss.map((roomMsg, index) => (

                            <div key={index}
                                className={`mt-2 mt-lg-3 ${roomMsg.sender === currentUser._id ? 'text-right' : 'text-left'}`}>
                                <div
                                    className={`bubble d-inline-block p-2 ${roomMsg.sender === currentUser._id ? 'ml-auto' : 'mr-auto'}`}
                                    style={{
                                        backgroundColor: roomMsg.sender === currentUser._id ? '#f1f0f0' : '#6a89cc',
                                        color: roomMsg.sender === currentUser._id ? '' : 'white',
                                        borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem', fontWeight: '500', lineHeight: '1.2', verticalAlign: 'baseline', wordBreak: 'break-word'
                                    }}>
                                    {roomMsg.content}
                                </div>

                                <small className="text-info">
                                    <i className={`${roomMsg.sender === currentUser._id ? 'text-right' : 'text-left'} d-block mt-2`} style={{ fontSize: ".7rem", color: "#999" }}>
                                        {moment(new Date(roomMsg.createdAt)).format('YYYY-MM-DD, HH:mm')}
                                    </i>
                                </small>
                            </div>
                        )) :

                        <div className='text-center mt-3 text-success'>Start the chat!</div>
                }

                <div ref={lastMessageRef} />

                <div>
                    <p style={{ fontSize: ".65rem", color: "magenta" }}>{typingStatus}</p>
                </div>
                <hr />

                {/* CHAT BOX */}
                <Form className='d-flex flex-column flex-lg-row mt-3' onSubmit={onSubmitHandler}>
                    <FormGroup className='flex-grow-1'>
                        <Input type='textarea' name='message_content' placeholder='Type your message here...' rows="5" onChange={onChangeHandler} onKeyDown={handleTyping} value={roomMessageState.message_content} required />
                    </FormGroup>

                    <Button color='primary' className='ml-2' style={{ height: "max-content" }}>
                        Send
                    </Button>
                </Form>


                {/* Error frontend*/}
                {/* {errorsState.length > 0 ?
                    errorsState.map(err =>
                        <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                            {err}
                        </Alert>) :
                    null
                } */}

                {/* Error backend */}
                {/* {errors.id ?
                    <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                        <small>{errors.msg && errors.msg.msg}</small>
                    </Alert> :

                    successful.id ?
                        <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                            <small>{successful.msg && successful.msg}</small>
                        </Alert> : null
                } */}

            </div>
    )
}

const mapStateToProps = state => ({
    roomMessages: state.contactsReducer,
    chatRoom: state.contactsReducer,
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { getCreateRoom, getRoomMessages, sendRoomMessage, clearErrors, clearSuccess })(RoomChatComponent)