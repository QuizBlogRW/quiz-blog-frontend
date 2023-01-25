import React, { useState, useContext } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap'
import LoginModal from '../auth/LoginModal'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { connect } from 'react-redux'
import { updateFaq } from '../../redux/faqs/faqs.actions'
import EditIcon from '../../images/edit.svg'
import Webmaster from '../webmaster/Webmaster'
import SpinningBubbles from '../rLoading/SpinningBubbles'
import { authContext } from '../../appContexts'

const EditFaq = ({ faqToEdit, errors, successful, clearErrors, clearSuccess, updateFaq }) => {

    // context
    const auth = useContext(authContext)

    const [faqState, setFaqState] = useState({
        faqID: faqToEdit._id,
        title: faqToEdit.title,
        answer: faqToEdit.answer
    })

    // progress
    const [progress, setProgress] = useState(false)

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
        setErrorsState([])
        clearErrors()
        clearSuccess()
        setFaqState({ ...faqState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { faqID, title, answer } = faqState

        // VALIDATE
        if (title.length < 4 || answer.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 50) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (answer.length > 100) {
            setErrorsState(['Answer is too long!'])
            return
        }

        // Create new FAQ object
        const updatedFaq = {
            faqID,
            title,
            answer
        }

        // Attempt to update
        updateFaq(updatedFaq)

        // Display the progress bar
        setProgress(true)
    }
    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-dark p-0">
                        <img src={EditIcon} alt="" width="16" height="16" />
                    </NavLink>

                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Edit FAQ
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
                                <Alert isOpen={visible} toggle={onDismiss} color='danger' className='border border-warning'>
                                    <small>{errors.msg && errors.msg}</small>
                                </Alert> :
                                successful.id ?
                                    <Alert color='success' isOpen={visible} toggle={onDismiss} className='border border-warning'>
                                        <small>{successful.msg && successful.msg}</small>
                                    </Alert> : null
                            }

                            {(progress && !successful.id && !errors.id) ? <Progress animated color="warning" value={100} className='mb-2' /> : null}

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="title">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="title" placeholder="FAQ title ..." className="mb-3" onChange={onChangeHandler} value={faqState.title} />

                                    <Label for="answer">
                                        <strong>Answer</strong>
                                    </Label>

                                    <Input type="text" name="answer" placeholder="FAQ answer ..." className="mb-3" onChange={onChangeHandler} value={faqState.answer} />

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

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { updateFaq, clearErrors, clearSuccess })(EditFaq)