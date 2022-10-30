import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import { connect } from 'react-redux'
import LoginModal from '../../auth/LoginModal'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { createPostCategory } from '../../../redux/blog/postCategories/postCategories.actions'
import Webmaster from '../../webmaster/Webmaster'
import SpinningBubbles from '../../rLoading/SpinningBubbles'
import Notification from '../../categories/Notification'

const CreateBPCategory = ({ auth, clearErrors, clearSuccess, createPostCategory }) => {

    const [bPCategoryState, setBPCategoryState] = useState({
        title: '',
        description: ''
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
        setBPCategoryState({ ...bPCategoryState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, description } = bPCategoryState

        // VALIDATE
        if (title.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 50) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 100) {
            setErrorsState(['Description is too long!'])
            return
        }

        // Create new Category object
        const newBPCategory = {
            title,
            description,
            creator: auth.isLoading === false ? auth.user._id : null
        }

        // Attempt to create
        createPostCategory(newBPCategory)

        // Reset the form
        setBPCategoryState({
            title: '',
            description: ''
        })

        // Display the progress bar
        setProgress(true)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-success p-0"><b>+</b> BP Category</NavLink>

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Create Blog Post Category
                        </ModalHeader>

                        <ModalBody>

                            <Notification errorsState={errorsState} progress={progress} />

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="title">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="title" id="title" placeholder="Category title ..." className="mb-3" onChange={onChangeHandler} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Category description ..." className="mb-3" onChange={onChangeHandler} />

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

export default connect(null, { createPostCategory, clearErrors, clearSuccess })(CreateBPCategory)
