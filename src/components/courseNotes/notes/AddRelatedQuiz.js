import React, { useEffect, useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input } from 'reactstrap'
import { connect } from 'react-redux'
import { getQuizesByNotes } from '../../../redux/quizes/quizes.actions'
import { addNotesQuizes } from '../../../redux/notes/notes.actions'
import AddIcon from '../../../images/plus.svg'

const AddRelatedQuiz = ({ noteID, getQuizesByNotes, notesQuizes, addNotesQuizes, courseCategoryID }) => {

    const [quizesState, setQuizesState] = useState()

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    // Lifecycle methods
    useEffect(() => {
        if (courseCategoryID) {
            getQuizesByNotes(courseCategoryID)
        }
    }, [getQuizesByNotes, courseCategoryID])

    const onChangeHandler = e => {
        setQuizesState(e.target.value)
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const notesQuizzes = {
            noteID,
            quizesState
        }
        // Attempt to update
        addNotesQuizes(notesQuizzes)
    }

    return (

                <>
                    <Button onClick={toggle} color="warning" size="sm" className="mx-2">
                        <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                        &nbsp; Quizzes
                    </Button>

                    <Modal isOpen={modal} toggle={toggle}>

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Add Quizzes
                        </ModalHeader>

                        <ModalBody>

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="title">
                                        <strong>Quiz Title</strong>
                                    </Label>

                                    <Input type="select" name="quizID" placeholder="Quiz title..." className="mb-3" onChange={onChangeHandler} value={quizesState || ''}>

                                        {notesQuizes && notesQuizes.map(quiz =>
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
                </>
    )
}

// Map the question to state props
const mapStateToProps = state => ({
    notesQuizes: state.quizesReducer.notesQuizes
})

export default connect(mapStateToProps, { getQuizesByNotes, addNotesQuizes })(AddRelatedQuiz)