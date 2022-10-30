import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { sendBroadcast } from '../../redux/broadcasts/broadcasts.actions'

const BroadcastModal = ({ currentUser, sendBroadcast, errors, successful, clearErrors, clearSuccess }) => {

    const userId = currentUser && currentUser._id
    const [broadcastState, setBroadcastState] = useState({
        title: '',
        message: ''
    })

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
        clearErrors()
        clearSuccess()
        setBroadcastState({ ...broadcastState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, message } = broadcastState

        // VALIDATE
        if (title.length < 4 || message.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 200) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (message.length > 1000) {
            setErrorsState(['message is too long!'])
            return
        }

        // Create new Quiz object
        const newMessage = {
            title,
            message,
            sent_by: userId
        }

        // Attempt to create
        sendBroadcast(newMessage)

        setBroadcastState({
            title: '',
            message: ''
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-0"><b>+</b> Broadcast</NavLink>

            <Modal
                // Set it to the state of modal true or false
                isOpen={modal}
                toggle={toggle}
            >

                <ModalHeader toggle={toggle} className="bg-primary text-white">
                    Send a broadcast message
                </ModalHeader>

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

                            <Label for="title">
                                <strong>Title</strong>
                            </Label>

                            <Input type="text" name="title" placeholder="Broadcast title ..." className="mb-3" onChange={onChangeHandler} value={broadcastState.title} />

                            <Label for="message">
                                <strong>Message</strong>
                            </Label>

                            <Input type="textarea" name="message" placeholder="Broadcast message ..." className="mb-3" minLength="5" maxLength="1000" onChange={onChangeHandler} value={broadcastState.message} />

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

// Map  state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { sendBroadcast, clearErrors, clearSuccess })(BroadcastModal)