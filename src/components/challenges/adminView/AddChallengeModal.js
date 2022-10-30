import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { clearErrors } from '../../../redux/error/error.actions'
import { clearSuccess } from '../../../redux/success/success.actions'
import { createChQuiz } from '../../../redux/challenges/challengeQuizzes/challengeQuizzes.actions'

const AddChallengeModal = ({ currentUser, createChQuiz, errors, successful, clearErrors, clearSuccess, categories }) => {

    const userId = currentUser && currentUser._id
    const catgs = categories && categories.allcategories

    const [chQuizState, setChQuizState] = useState({
        title: '',
        description: '',
        duration: 0,
        category: '',
        created_by: userId ? userId : null,
    })

    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal)

    const onChangeHandler = e => {
        clearErrors()
        clearSuccess()
        setChQuizState({ ...chQuizState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, description, duration, category, created_by } = chQuizState

        // VALIDATE
        if (title.length < 4 || description.length < 4 || duration < 1 || !category || !created_by) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 200) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 1000) {
            setErrorsState(['message is too long!'])
            return
        }

        // Create new Quiz object
        const newChQuiz = {
            title,
            description,
            duration,
            category,
            created_by
        }

        // Attempt to create
        createChQuiz(newChQuiz)

        // Reset form fields
        setChQuizState({
            title: '',
            description: '',
            duration: 0,
            category: '',
            created_by: userId ? userId : null,
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-0"><b>+</b> CHALLENGE</NavLink>

            <Modal
                // Set it to the state of modal true or false
                isOpen={modal}
                toggle={toggle}
            >

                <ModalHeader toggle={toggle} className="bg-primary text-white">
                    CREATE A NEW CHALLENGE
                </ModalHeader>

                <ModalBody>
                    {/* Error frontend*/}
                    {errorsState.length > 0 ?
                        errorsState.map(err =>
                            <Alert color="danger" isOpen={visible} toggle={onDismiss} key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                {err}
                            </Alert>) :
                        null
                    }

                    {/* Error backend */}
                    {errors.id ?
                        <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                            <small>{errors.msg && errors.msg.msg}</small>
                        </Alert> :

                        successful.id ?
                            <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                                <small>{successful.msg && successful.msg}</small>
                            </Alert> : null
                    }

                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>

                            <Label for="title">
                                <strong>Title</strong>
                            </Label>

                            <Input type="text" name="title" placeholder="Challenge title ..." className="mb-3" onChange={onChangeHandler} value={chQuizState.title} />

                            <Label for="description">
                                <strong>Description</strong>
                            </Label>

                            <Input type="textarea" name="description" placeholder="Challenge description ..." className="mb-3" minLength="5" maxLength="500" onChange={onChangeHandler} value={chQuizState.description} />

                            <Label for="duration">
                                <strong>Duration</strong>
                            </Label>

                            <Input type="number" name="duration" placeholder="Challenge duration in seconds..." className="mb-3" onChange={onChangeHandler} value={chQuizState.duration} />

                            <Label for="category">
                                <strong>Category</strong>
                            </Label>

                            <Input type="select" name="category" placeholder="Challenge category..." className="mb-3 text-uppercase" onChange={onChangeHandler} value={chQuizState.category || ''}>

                                <option>-- Select Category--</option>
                                {catgs && catgs.map(cat =>
                                    <option key={cat._id} value={cat._id}>
                                        {cat.title}
                                    </option>)}
                            </Input>

                            <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                        </FormGroup>

                    </Form>
                </ModalBody>
            </Modal>
        </div>
    )
}

// Map  state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { createChQuiz, clearErrors, clearSuccess })(AddChallengeModal)