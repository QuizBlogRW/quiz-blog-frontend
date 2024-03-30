import React, { useState, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import AddIcon from '../../images/plus.svg'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { createQuiz } from '../../redux/slices/quizesSlice'
import { useDispatch } from 'react-redux'
import { authContext } from '../../appContexts'
import Notification from '../../utils/Notification'

const AddQuiz = ({ category }) => {

    // Redux
    const dispatch = useDispatch()

    // context
    const auth = useContext(authContext)

    const [quizState, setQuizState] = useState({
        name: '',
        description: ''
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
        setQuizState({ ...quizState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { name, description } = quizState

        // VALIDATE
        if (name.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (name.length > 70) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 120) {
            setErrorsState(['Description is too long!'])
            return
        }

        // Create new Quiz object
        const newQuiz = {
            title: name,
            description,
            category: category._id,
            created_by: auth.isLoading === false ? auth.user._id : null
        }

        // Attempt to create
        dispatch(createQuiz(newQuiz))
    }

    return (
        <div>
            <NavLink onClick={toggle} className="p-0 d-flex justify-center align-items-center">
                <img src={AddIcon} alt="" width="10" height="10" className="fw-bolder" />
                &nbsp; Add Quiz
            </NavLink>

            <Modal
                isOpen={modal}
                toggle={toggle}
            >
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Add {category.title} Quiz
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>
                    <Notification errorsState={errorsState} progress={null} initFn="createQuiz" />

                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>

                            <Label for="name">
                                <strong>Title</strong>
                            </Label>

                            <Input type="text" name="name" id="name" placeholder="Quiz name ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="description">
                                <strong>Description</strong>
                            </Label>

                            <Input type="text" name="description" id="description" placeholder="Quiz description ..." className="mb-3" onChange={onChangeHandler} />

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default AddQuiz