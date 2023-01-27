import React, { useState, useEffect, useRef, useContext } from 'react'
import { Form, FormGroup, Button, Input, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { getOneContact, replyContact } from '../../../redux/contacts/contacts.actions'
import moment from 'moment'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { currentUserContext } from '../../../appContexts'

const ChatComponent = ({ socket, onlineList, chatId, cntct, getOneContact, replyContact, errors, successful, clearErrors, clearSuccess }) => {

    // context
    const currentUser = useContext(currentUserContext)

    const contact = cntct && cntct.oneContact
    const lastMessageRef = useRef(null);

    useEffect(() => {
        // scroll to bottom every time messages change
        lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [contact]);

    // Get one contact from the chatId passed in from ContactChatCard component 
    useEffect(() => {
        getOneContact(chatId)
    }, [getOneContact, chatId])

    const [contactState, setContactState] = useState({
        message: '',
    })

    const [typingStatus, setTypingStatus] = useState('');

    // Who to send mail to
    const toMail = currentUser.role === 'Visitor' ?
        'quizblog.rw@gmail.com' : contact && contact.email

    // Lifecycle methods
    useEffect(() => {
        // If other user, send from their mail
        if (currentUser.role === 'Visitor') {
            setContactState(contactState => ({ ...contactState, email: currentUser.email }))
        }

    }, [currentUser, contactState.message])

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    // Typing state on form
    const handleTyping = () =>
        socket.emit('typing', `${currentUser && currentUser.name} is typing`);

    useEffect(() => {
        socket.on('typingResponse', (data) => setTypingStatus(data));
    }, [socket]);


    const onChangeHandler = e => {
        clearErrors()
        clearSuccess()
        setContactState({ ...contactState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { message } = contactState

        // VALIDATE
        if (currentUser.email.length < 4 || message.length < 1) {
            setErrorsState(['Insufficient info!'])
            return
        }

        else if (message.length > 1000) {
            setErrorsState(['message is too long!'])
            return
        }

        // Create reply object
        const reply = {
            reply_name: currentUser.name,
            email: currentUser.email,
            to_contact: toMail,
            to_contact_name: contact.contact_name,
            contact_question: contact.message,
            message
        }

        // Attempt to reply - save to database
        replyContact(contact._id, reply)

        // send reply to server
        socket.emit('reply', reply)

        // clear the contact state
        setContactState({ message: '' })
    }

    // runs whenever a the backend returns back the reply received
    useEffect(() => {
        socket.on('backReply', reply => {
            // Getting the updated contact with replies
            getOneContact(chatId)
            console.log('backReply', reply)
        })
    }, [socket, getOneContact, chatId])

    const whoWith = currentUser.role === 'Visitor' ? { username: 'Quiz Blog Rwanda', email: 'quizblog.rw@gmail.com' } : { username: contact && contact.contact_name, email: contact && contact.email }

    const matchingUsr = onlineList.find((user) => user.email === toMail);
    const status = matchingUsr && matchingUsr.email === whoWith.email ? '🟢' : '🔴'

    // Avoiding the component from reloading on state change

    return (
        cntct.isOneLoading ? <SpinningBubbles title='chat messages' /> :

            <div className='h-100'>
                <h4
                    className='text-center py-2 py-lg-4 mt-5 mt-lg-3 font-weight-bold border rounded'
                    style={{ backgroundColor: "burlywood" }}>
                    {whoWith.username}&nbsp;
                    <small style={{ fontSize: ".5rem", verticalAlign: "middle" }}>{status}</small>
                </h4>
                <hr />

                {/* ORIGINAL MESSAGE */}
                <div className='bubble d-inline-block p-2 mr-auto'
                    style={{
                        backgroundColor: '#6a89cc',
                        color: 'white',
                        borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem', fontWeight: '500', lineHeight: '1.2', verticalAlign: 'baseline', wordBreak: 'break-word'
                    }}>
                    {contact.message}
                </div>

                <small className="text-info">
                    <i className='text-left d-block mt-2' style={{ fontSize: ".7rem", color: "#6a89cc" }}>
                        {moment(new Date(contact.contact_date))
                            .format('YYYY-MM-DD, HH:mm')}
                    </i>
                </small>


                {/* REPLIES */}
                {contact.replies.map((reply, index) => (
                    <div key={index}
                        className={`mt-2 mt-lg-3 ${reply.email === currentUser.email ? 'text-right' : 'text-left'}`}>

                        <div
                            className={`bubble d-inline-block p-2 ${reply.email === currentUser.email ? 'ml-auto' : 'mr-auto'}`}
                            style={{
                                backgroundColor: reply.email === currentUser.email ? '#f1f0f0' : '#6a89cc',
                                color: reply.email === currentUser.email ? '' : 'white',
                                borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', whiteSpace: 'pre-wrap', fontSize: '.8rem', fontWeight: '500', lineHeight: '1.2', verticalAlign: 'baseline', wordBreak: 'break-word'
                            }}>
                            {reply.message}
                        </div>

                        <small className="text-info">
                            <i className={`${reply.email === currentUser.email ? 'text-right' : 'text-left'} d-block mt-2`} style={{ fontSize: ".7rem", color: "#999" }}>
                                {moment(new Date(reply.reply_date)).format('YYYY-MM-DD, HH:mm')}
                            </i>
                        </small>
                    </div>
                ))}

                <div ref={lastMessageRef} />

                <div>
                    <p style={{ fontSize: ".65rem", color: "magenta" }}>{typingStatus}</p>
                </div>
                <hr />

                {/* CHAT BOX */}
                <Form className='d-flex flex-column flex-lg-row mt-3' onSubmit={onSubmitHandler}>
                    <FormGroup className='flex-grow-1'>
                        <Input type='textarea' name='message' placeholder='Type your message here...' rows="5" onChange={onChangeHandler} onKeyDown={handleTyping} value={contactState.message} required />
                    </FormGroup>
                    <Button color='primary' className='ml-2' style={{ height: "max-content" }}>
                        Send
                    </Button>
                </Form>

                {/* Error frontend*/}
                {errorsState.length > 0 ?
                    errorsState.map(err =>
                        <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                            {err}
                        </Alert>) :
                    null
                }

                {/* Error backend */}
                {errors.id ?
                    <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                        <small>{errors.msg && errors.msg.msg}</small>
                    </Alert> :

                    successful.id ?
                        <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                            <small>{successful.msg && successful.msg}</small>
                        </Alert> : null
                }

            </div>
    )
}

const mapStateToProps = state => ({
    cntct: state.contactsReducer,
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { getOneContact, replyContact, clearErrors, clearSuccess })(ChatComponent)