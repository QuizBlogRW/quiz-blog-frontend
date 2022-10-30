import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { connect } from 'react-redux'
import { createCategory } from '../../redux/categories/categories.actions'
import Webmaster from '../webmaster/Webmaster'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import Notification from './Notification'
const CreateCategory = ({ auth, clearErrors, clearSuccess, courseCategories, createCategory }) => {

    const [categoryState, setCategoryState] = useState({
        name: '',
        description: '',
        courseCategory: ''
    })

    // progress
    const [progress, setProgress] = useState(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        // Remove errors
        setErrorsState([])
        clearErrors()
        clearSuccess()
        // Add data
        setCategoryState({ ...categoryState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { name, description, courseCategory } = categoryState

        // VALIDATE
        if (name.length < 4 || description.length < 4 || courseCategory.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (name.length > 50) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 100) {
            setErrorsState(['Description is too long!'])
            return
        }

        // Create new Category object
        const newCategory = {
            title: name,
            description,
            creation_date: Date.now,
            created_by: auth.isLoading === false ? auth.user._id : null,
            courseCategory: courseCategory
        }

        // Attempt to create
        createCategory(newCategory)

        // Reset the form
        setCategoryState({
            name: '',
            description: ''
        })

        // Display the progress bar
        setProgress(true)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-success p-0"><b>+</b> Create Category</NavLink>

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Create Category
                        </ModalHeader>

                        <ModalBody>

                            <Notification errorsState={errorsState} progress={progress} />

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="name" id="name" placeholder="Category name ..." className="mb-3" onChange={onChangeHandler} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Category description ..." className="mb-3" onChange={onChangeHandler} />

                                    <Label for="courseCategory">
                                        <strong>Course Category</strong>
                                    </Label>

                                    <Input type="select" name="courseCategory" placeholder="Category title..." className="mb-3" onChange={onChangeHandler} value={categoryState.courseCategory}>

                                        {!categoryState.courseCategory ?
                                            <option>Choose a course category ...</option> :
                                            null}

                                        {courseCategories && courseCategories.map(courseCategory =>
                                            <option key={courseCategory._id} value={courseCategory._id}>
                                                {courseCategory.title}
                                            </option>
                                        )}
                                    </Input>

                                    <Button color="success" style={{ marginTop: '2rem' }} block >
                                        Create
                                    </Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div> :

                <Webmaster auth={auth} /> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'}
                            isAuthenticated={auth.isAuthenticated} />
                }
            </div>
    )
}

export default connect(null, { createCategory, clearErrors, clearSuccess })(CreateCategory)