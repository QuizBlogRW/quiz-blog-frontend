import React, { useState, useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux'
import { updateQuiz } from '../../redux/quizes/quizes.actions'
import EditIcon from '../../images/edit.svg'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext, categoriesContext } from '../../appContexts'

const EditQuiz = ({ quizToEdit, updateQuiz }) => {

    // context
    const auth = useContext(authContext)
    const categories = useContext(categoriesContext)

    const [quizState, setQuizState] = useState({
        quizID: quizToEdit._id,
        name: quizToEdit.title,
        description: quizToEdit.description,
        oldCategoryID: quizToEdit.category && quizToEdit.category._id,
        category: quizToEdit.category && quizToEdit.category._id
    })

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        setQuizState({ ...quizState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { quizID, name, description, category, oldCategoryID } = quizState

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
        const updatedQuiz = {
            quizID,
            title: name,
            description,
            last_updated_by: auth.isLoading ? null : auth.user.id,
            category,
            oldCategoryID
        }

        // Attempt to update
        updateQuiz(updatedQuiz)

        // close the modal
        if (modal) {
            toggle()
        }
    }
    return (

        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <img src={EditIcon} onClick={toggle} alt="" width="16" height="16" className="mr-3" />

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">Edit Quiz</ModalHeader>

                        <ModalBody>

                            {errorsState.length > 0 ?
                                errorsState.map(err =>
                                    <Alert color="danger" key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                        {err}
                                    </Alert>) :
                                null
                            }

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="name" id="name" placeholder="Quiz name ..." className="mb-3" onChange={onChangeHandler} value={quizState.name} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Category description ..." className="mb-3" onChange={onChangeHandler} value={quizState.description} />

                                    <Input type="select" name="category" placeholder="Quiz title..." className="mb-3" onChange={onChangeHandler} value={quizState.category}>

                                        {categories && categories.allcategories.map(category =>
                                            <option key={category._id} value={category._id}>
                                                {category.title}
                                            </option>
                                        )}

                                    </Input>

                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Update
                                    </Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div> :

                <Webmaster /> :

            // If not authenticated or loading
            <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
                {
                    auth.isLoading ?
                        <SpinningBubbles /> :
                        <LoginModal
                            textContent={'Login first'}
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>
    )
}

export default connect(null, { updateQuiz })(EditQuiz)
