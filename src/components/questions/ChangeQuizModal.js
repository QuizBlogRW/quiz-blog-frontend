import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux'
import { updateQuestion } from '../../redux/questions/questions.actions'
import { getQuizesByCategory } from '../../redux/quizes/quizes.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles'

const ChangeQuizModal = ({ auth, updateQuestion, getQuizesByCategory, categoryQuizes, questionID, quizID, questionCatID }) => {

    const oldQuizID = quizID
    const [newQuestionState, setNewQuestionState] = useState({
        qtId: questionID,
        quizID
    })

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    // Lifecycle methods
    useEffect(() => {
        if (questionCatID) {
            getQuizesByCategory(questionCatID)
        }
    }, [getQuizesByCategory, questionCatID])

    const onChangeHandler = e => {
        setNewQuestionState({ ...newQuestionState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { qtId, quizID } = newQuestionState

        // Create new User object
        const updatedQuestion = {
            quiz: quizID,
            oldQuizID,
            last_updated_by: auth.isLoading === false ? auth.user._id : null
        }

        // Attempt to update
        updateQuestion(qtId, updatedQuestion)

        // close the modal
        if (modal) {
            toggle()
        }
    }

    return (

        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <Button onClick={toggle} color="info" size="sm" className="mr-3 p-1 w-100">
                        Change Quiz
                    </Button>

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">Change Quiz</ModalHeader>

                        <ModalBody>

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="title">
                                        <strong>Quiz Title</strong>
                                    </Label>

                                    <Input type="select" name="quizID" placeholder="Quiz title..." className="mb-3" onChange={onChangeHandler} value={newQuestionState.quizID || ''}>

                                        {!newQuestionState.quizID ?
                                            <option>-- Select a quiz--</option> :
                                            null}

                                        {categoryQuizes && categoryQuizes.map(quiz =>
                                            <option key={quiz._id} value={quiz._id}>
                                                {quiz.title}
                                            </option>)}
                                    </Input>

                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Save
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

// Map the question to state props
const mapStateToProps = state => ({
    categories: state.categoriesReducer,
    categoryQuizes: state.quizesReducer.categoryQuizes
})

export default connect(mapStateToProps, { updateQuestion, getQuizesByCategory })(ChangeQuizModal)