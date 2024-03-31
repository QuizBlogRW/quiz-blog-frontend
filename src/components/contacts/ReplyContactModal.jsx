import React, { useState, useEffect, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { replyContact } from '../../redux/slices/contactsSlice'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { useDispatch } from "react-redux"
import { currentUserContext } from '../../appContexts'
import Notification from '../../utils/Notification'

const ReplyContactModal = ({ thisContact }) => {

    // Redux
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
        dispatch(replyContact({ idToUpdate: thisContact._id, reply }))
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

                    <Notification errorsState={errorsState} progress={null} initFn="replyContact" />
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