import React, { useEffect, useState, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { updateQuestion } from '../../redux/slices/questionsSlice'
import { getQuizesByCategory } from '../../redux/slices/quizesSlice'
import { useSelector, useDispatch } from 'react-redux'
import { authContext } from '../../appContexts'
import Notification from '../../utils/Notification'

const ChangeQuizModal = ({ questionID, quizID, questionCatID }) => {

    // Redux
    const categoryQuizes = useSelector(state => state.quizes.categoryQuizes)
    const dispatch = useDispatch()

    // context
    const auth = useContext(authContext)

    const oldQuizID = quizID
    const [newQuestionState, setNewQuestionState] = useState({
        questionId: questionID,
        quizID
    })

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    // Lifecycle methods
    useEffect(() => {
        if (questionCatID) {
            dispatch(getQuizesByCategory(questionCatID))
        }
    }, [questionCatID, dispatch])

    const onChangeHandler = e => {
        setNewQuestionState({ ...newQuestionState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { questionId, quizID } = newQuestionState
        const updatedQuestion = {
            quiz: quizID,
            oldQuizID,
            last_updated_by: auth.isLoading === false ? auth.user._id : null
        }

        dispatch(updateQuestion({ questionId, updatedQuestion }))
        if (modal) toggle()
    }

    return (

        <div>
            <Button onClick={toggle} color="info" size="sm" className="me-3 p-1 w-100">
                Change Quiz
            </Button>

            <Modal
                isOpen={modal}
                toggle={toggle}
            >
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    Change Quiz
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>

                    <Notification errorsState={null} progress={null} initFn="updateQuestion" />

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
        </div>
    )
}

export default ChangeQuizModal