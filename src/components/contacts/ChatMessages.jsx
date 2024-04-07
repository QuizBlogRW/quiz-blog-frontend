import React, { useState, useEffect, useRef, useContext } from 'react'
import { Form, FormGroup, Button, Input } from 'reactstrap'
import { replyContact } from '../../redux/slices/contactsSlice'
import moment from 'moment'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import { useSelector, useDispatch } from "react-redux"
import { currentUserContext } from '../../appContexts'
import Notification from '../../utils/Notification'

// Socket.io
import { socket } from '../../utils/socket'

const ChatMessages = ({ onlineList }) => {

    // redux
    const contacts = useSelector(state => state.contacts)
    const { oneContact, reply, isLoading } = contacts
    const dispatch = useDispatch()

    // context
    const currentUser = useContext(currentUserContext)
    const lastMessageRef = useRef(null);

    // State
    const [replies, setReplies] = useState(oneContact ? oneContact.replies : [])
    const [newMessage, setNewMessage] = useState('')
    const [errorsState, setErrorsState] = useState([])

    // Who to send mail to
    const toMail = currentUser.role === 'Visitor' ? 'quizblog.rw@gmail.com' : oneContact && oneContact.email
    const whoWith = currentUser.role === 'Visitor' ? { username: 'Quiz-Blog Rwanda', email: 'quizblog.rw@gmail.com' } : { username: oneContact && oneContact.contact_name, email: oneContact && oneContact.email }
    const matchingUsr = onlineList.find((user) => user.email === toMail);
    const onlineStatus = matchingUsr && matchingUsr.email === whoWith.email ? '🟢' : '🔴'

    const sendMessage = e => {
        e.preventDefault()

        // VALIDATE
        if (currentUser.email.length < 4 || newMessage.length < 1) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (newMessage.length > 1000) {
            setErrorsState(['message is too long!'])
            return
        }

        // Create reply object
        const reply = {
            reply_name: currentUser.name,
            email: currentUser.email,
            to_contact: toMail,
            to_contact_name: oneContact.contact_name,
            contact_question: oneContact.message,
            message: newMessage
        }

        // Attempt to reply - save to database
        dispatch(replyContact({ idToUpdate: oneContact._id, reply }))

        // clear the contact state
        setNewMessage('')
    }

    useEffect(() => {

        // Scroll to the bottom of the chat
        lastMessageRef.current.scrollTo({ top: 10, behavior: "smooth" })

        // Listen for incoming messages
        socket.on('replyReceived', (replyReceived) => {
            setReplies(prevReplies => [...prevReplies, replyReceived])
        })

        return () => {
            socket.off('replyReceived')
        }
    }, [socket])

    // Avoiding the component from reloading on state change
    return (
        isLoading ? <QBLoadingSM title='chat messages' /> :

            <div className='h-100'>
                <div ref={lastMessageRef} />
                <h4
                    className='text-center py-2 py-lg-4 mt-5 mt-lg-3 fw-bolder border rounded'
                    style={{ backgroundColor: "burlywood" }}>
                    {whoWith.username}&nbsp;
                    <small style={{ fontSize: ".5rem", verticalAlign: "middle" }}>{onlineStatus}</small>
                </h4>

                {/* ORIGINAL MESSAGE */}
                <strong>{oneContact && oneContact.message}</strong>

                <small className="text-info mb-2">
                    <i className='text-start d-block mt-2' style={{ fontSize: ".7rem", color: "#6a89cc" }}>
                        {moment(new Date(oneContact && oneContact.contact_date)).format('YYYY-MM-DD, HH:mm')}
                    </i>
                </small>

                <Notification errorsState={errorsState} progress={null} initFn="replyContact" />
                {/* CHAT BOX */}
                <Form className='w-100 m-1 mb-lg-5 d-flex flex-column align-center justify-center' onSubmit={sendMessage}>
                    <FormGroup className='flex-grow-1 w-100'>
                        <Input type='textarea' name='message' placeholder='Type your message here...' rows="5" onChange={(e) => setNewMessage(e.target.value)} value={newMessage} required />
                    </FormGroup>
                    <Button className='mx-auto w-50' style={{ height: "max-content", backgroundColor: "#157A6E" }}>
                        Send
                    </Button>
                </Form>
                <hr />

                {/* REPLIES */}
                {replies && [...replies].sort((a, b) => new Date(b.reply_date) - new Date(a.reply_date)).map((reply, index) => (
                    <div key={index}
                        className={`mt-2 mt-lg-3 ${reply.email === currentUser.email ? 'text-end' : 'text-start'}`}>
                        <div
                            className={`bubble d-inline-block p-2 ${reply.email === currentUser.email ? 'ms-auto' : 'me-auto'}`}
                            style={{
                                backgroundColor: reply.email === currentUser.email ? '#f1f0f0' : '#6a89cc',
                                color: reply.email === currentUser.email ? '' : 'white',
                                borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem', fontWeight: '500', lineHeight: '1.2', verticalAlign: 'baseline', wordBreak: 'break-word'
                            }}>
                            {reply && reply.message}
                        </div>

                        <small className="text-info">
                            <i className={`${reply.email === currentUser.email ? 'text-end' : 'text-start'} d-block mt-2`} style={{ fontSize: ".7rem", color: "#999" }}>
                                {moment(new Date(reply.reply_date)).format('YYYY-MM-DD, HH:mm')}
                            </i>
                        </small>
                    </div>
                ))}
            </div>
    )
}

export default ChatMessages
