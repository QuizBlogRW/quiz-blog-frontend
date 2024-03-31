import React, { useState, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { createFq } from '../../redux/slices/faqsSlice'
import { useDispatch } from 'react-redux'
import { authContext } from '../../appContexts'
import Notification from '../../utils/Notification'

const CreateFaq = () => {

    // Redux
    const dispatch = useDispatch()

    // context
    const currentUser = useContext(authContext)

    const [faqsState, setFaqsState] = useState({
        title: '',
        answer: '',
        created_by: currentUser ? currentUser._id : null
    })

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        dispatch(clearErrors())
        dispatch(clearSuccess())
        setFaqsState({ ...faqsState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, answer, created_by } = faqsState

        // VALIDATE
        if (title.length < 4 || answer.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 200) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (answer.length > 1000) {
            setErrorsState(['answer is too long!'])
            return
        }

        // Create new Quiz object
        const newFaq = {
            title,
            answer,
            created_by
        }

        // Attempt to create
        dispatch(createFq(newFaq))

        setFaqsState({
            title: '',
            answer: ''
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-1 my-2 border rounded  border-warning">
                <b>+</b> FAQ
            </NavLink>

            <Modal isOpen={modal} toggle={toggle}>

                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Create a FAQ
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>

                    <Notification errorsState={errorsState} progress={null} initFn="createFq" />
                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>

                            <Label for="title">
                                <strong>Title</strong>
                            </Label>

                            <Input type="text" name="title" placeholder="FAQ title ..." className="mb-3" onChange={onChangeHandler} value={faqsState.title} />

                            <Label for="answer">
                                <strong>Answer</strong>
                            </Label>

                            <Input type="textarea" name="answer" placeholder="FAQ answer ..." className="mb-3" minLength="5" maxLength="1000" onChange={onChangeHandler} value={faqsState.answer} />

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default CreateFaq