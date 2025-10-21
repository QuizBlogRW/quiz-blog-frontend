import { useEffect, useState } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { updateQuestion } from '@/redux/slices/questionsSlice'
import { getQuizzesByCategory } from '@/redux/slices/quizzesSlice'
import { useSelector, useDispatch } from 'react-redux'


const ChangeQuizModal = ({ questionID, oldQuizID, questionCatID }) => {

    // Redux
    const dispatch = useDispatch()
    const categoryQuizzes = useSelector(state => state.quizzes.categoryQuizzes)
    const { user, isLoading } = useSelector(state => state.auth)
    const [newQuestionState, setNewQuestionState] = useState({ questionID, newQuizID: null })

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    // Lifecycle methods
    useEffect(() => {
        if (questionCatID) dispatch(getQuizzesByCategory(questionCatID))
    }, [questionCatID, dispatch])
    const onChangeHandler = e => setNewQuestionState({ ...newQuestionState, [e.target.name]: e.target.value })

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append('newQuiz', newQuestionState.newQuizID)
        formData.append('oldQuizID', oldQuizID)
        formData.append('last_updated_by', isLoading === false ? user._id : null)

        const res = await dispatch(updateQuestion({ questionID: newQuestionState.questionID, formData }))
        if (res.payload) {
            modal && toggle()
            window.location.reload()

        }
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
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "var(--brand)", color: "#fff" }}>
                    Change Quiz
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggle}>
                        X
                    </Button>
                </div>

                <ModalBody>

                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>

                            <Label for="title">
                                <strong>Quiz Title</strong>
                            </Label>

                            <Input type="select" name="newQuizID" placeholder="Quiz title..." className="mb-3" onChange={onChangeHandler} value={newQuestionState.newQuizID || ''}>

                                {!newQuestionState.newQuizID ?
                                    <option>-- Select a quiz--</option> :
                                    null}

                                {categoryQuizzes && categoryQuizzes.map(quiz => quiz._id !== oldQuizID &&
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