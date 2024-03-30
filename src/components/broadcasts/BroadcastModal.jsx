import React, { useState, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { sendBroadcast } from '../../redux/slices/broadcastsSlice'
import { useSelector, useDispatch } from "react-redux"
import { authContext } from '../../appContexts'

const BroadcastModal = () => {

    const errors = useSelector(state => state.error)
    const successful = useSelector(state => state.success)
    const dispatch = useDispatch()

    const auth = useContext(authContext)
    const currentUser = auth && auth.user
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
        // Remove errors
        dispatch(clearErrors())
        dispatch(clearSuccess())
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
        dispatch(sendBroadcast(newMessage))

        setBroadcastState({
            title: '',
            message: ''
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-0"><b>+</b> Broadcast</NavLink>

            <Modal isOpen={modal} toggle={toggle}>
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Send a broadcast message
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

export default BroadcastModal