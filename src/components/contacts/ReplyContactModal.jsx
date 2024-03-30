import React, { useState, useEffect, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import { replyContact } from '../../redux/slices/contactsSlice'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { useSelector, useDispatch } from "react-redux"
import { currentUserContext } from '../../appContexts'

const ReplyContactModal = ({ thisContact }) => {

    // Redux
    const errors = useSelector(state => state.error)
    const successful = useSelector(state => state.success)
    const dispatch = useDispatch()

    // context
    const currentUser = useContext(currentUserContext)

    // State
    const [contactState, setContactState] = useState({
        email: 'quizblog.rw@gmail.com',
        message: '',
    })

    // Who to send mail to
    const toMail = currentUser.role === 'Visitor' ?
        'quizblog.rw@gmail.com' : thisContact && thisContact.email

    // Lifecycle methods
    useEffect(() => {
        // If other user, send from their mail
        if (currentUser.role === 'Visitor') {
            setContactState(contactState => ({ ...contactState, email: currentUser.email }))
        }
    }, [currentUser])

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setContactState({ ...contactState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { email, message } = contactState

        // VALIDATE
        if (email.length < 4 || message.length < 4) {
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
            email,
            to_contact: toMail,
            to_contact_name: thisContact.contact_name,
            contact_question: thisContact.message,
            message
        }

        // Attempt to reply
        dispatch(replyContact(thisContact._id, reply))
        setContactState({ message: '' })
    }

    return (
        <div>
            <span onClick={toggle}>Reply</span>

            <Modal isOpen={modal} toggle={toggle}>
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Reply
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>
                <ModalBody>

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

                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>
                            <Label for="email">To</Label>
                            <Input type="email" name="email" placeholder="To ..." className="mb-3" onChange={onChangeHandler} value={toMail && toMail} disabled />

                            <Label for="email">From</Label>
                            <Input type="email" name="email" placeholder="From ..." className="mb-3" onChange={onChangeHandler} value={contactState.email} disabled />

                            <FormGroup row>
                                <Input type="textarea" name="message" placeholder="Message" rows="5" minLength="10" maxLength="1000" onChange={onChangeHandler} value={contactState.message} required />
                            </FormGroup>

                            <Button color="warning" style={{ marginTop: '2rem' }} block>Reply</Button>

                        </FormGroup>

                    </Form>

                </ModalBody>
            </Modal>
        </div>
    )
}

export default ReplyContactModal