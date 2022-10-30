import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { createFq } from '../../redux/faqs/faqs.actions'

const CreateFaq = ({ currentUser, createFq, errors, successful, clearErrors, clearSuccess }) => {

    const [faqsState, setFaqsState] = useState({
        title: '',
        answer: '',
        created_by: currentUser ? currentUser._id : null
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
        setFaqsState({ ...faqsState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, answer, created_by } = faqsState

        // VALIDATE
        if (title.length < 4 || answer.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 200) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (answer.length > 1000) {
            setErrorsState(['answer is too long!'])
            return
        }

        // Create new Quiz object
        const newFaq = {
            title,
            answer,
            created_by
        }

        // Attempt to create
        createFq(newFaq)

        setFaqsState({
            title: '',
            answer: ''
        })
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-success p-1 border rounded  border-warning">
                <b>+</b> FAQ
            </NavLink>

            <Modal
                // Set it to the state of modal true or false
                isOpen={modal}
                toggle={toggle}
            >

                <ModalHeader toggle={toggle} className="bg-primary text-white">
                    Create a FAQ
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

                            <Input type="text" name="title" placeholder="FAQ title ..." className="mb-3" onChange={onChangeHandler} value={faqsState.title} />

                            <Label for="answer">
                                <strong>Answer</strong>
                            </Label>

                            <Input type="textarea" name="answer" placeholder="FAQ answer ..." className="mb-3" minLength="5" maxLength="1000" onChange={onChangeHandler} value={faqsState.answer} />

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

export default connect(mapStateToProps, { createFq, clearErrors, clearSuccess })(CreateFaq)