import React, { useState, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { createCourse } from '../../redux/slices/coursesSlice'
import { useSelector, useDispatch } from 'react-redux'
import AddIcon from '../../images/plus.svg'
import { authContext } from '../../appContexts'
import Notification from '../../utils/Notification'

const AddCourse = ({ categoryId }) => {

    // Redux
    const dispatch = useDispatch()

    // context
    const auth = useContext(authContext)

    const [courseState, setCourseState] = useState({
        title: '',
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
        setCourseState({ ...courseState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, description } = courseState

        // VALIDATE
        if (title.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 80) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 200) {
            setErrorsState(['Description is too long!'])
            return
        }

        // Create new course object
        const newCourse = {
            title,
            description,
            courseCategory: categoryId,
            created_by: auth.isLoading === false ? auth.user._id : null
        }

        // Attempt to create
        dispatch(createCourse(newCourse))
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-0">
                <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                &nbsp;Course
            </NavLink>

            <Modal
                isOpen={modal}
                toggle={toggle}
            >

                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Add New Course
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>
                    <Notification errorsState={errorsState} progress={null} initFn="createCourse" />
                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>

                            <Label for="name">
                                <strong>Title</strong>
                            </Label>

                            <Input type="text" name="title" id="title" placeholder="Course title ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="description">
                                <strong>Description</strong>
                            </Label>

                            <Input type="text" name="description" id="description" placeholder="Course description ..." className="mb-3" onChange={onChangeHandler} />

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default AddCourse