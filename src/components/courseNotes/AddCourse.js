import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap'
import AddIcon from '../../images/plus.svg'
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { createCourse } from '../../redux/courses/courses.actions'
import SpinningBubbles from '../rLoading/SpinningBubbles'

const AddCourse = ({ auth, createCourse, categoryId, errors, successful, clearErrors, clearSuccess }) => {

    const [courseState, setCourseState] = useState({
        title: '',
        description: ''
    })

    const [progress, setProgress] = useState()

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
        setCourseState({ ...courseState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, description } = courseState

        // VALIDATE
        if (title.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 80) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (description.length > 200) {
            setErrorsState(['Description is too long!'])
            return
        }

        setProgress(90)
        // Create new course object
        const newCourse = {
            title,
            description,
            courseCategory: categoryId,
            created_by: auth.isLoading === false ? auth.user._id : null
        }

        // Attempt to create
        createCourse(newCourse)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-success p-0">
                        <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                        &nbsp;Course
                    </NavLink>

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Add New Course
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

                            {progress &&
                                <div className={`${errors.id || successful.msg ? 'd-none' : ''} text-center text-danger font-weight-bolder`}>
                                    {progress - 1}%
                                    <Progress animated color="info" value={progress - 1} className='mb-2' />
                                </div>}

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="title" id="title" placeholder="Course title ..." className="mb-3" onChange={onChangeHandler} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Course description ..." className="mb-3" onChange={onChangeHandler} />

                                    <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div> :

                <Webmaster auth={auth} /> :

            // If not authenticated or loading
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

// Map  state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { createCourse, clearErrors, clearSuccess })(AddCourse)
