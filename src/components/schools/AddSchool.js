import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap'
import { connect } from 'react-redux'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { createSchool } from '../../redux/schools/schools.actions'
import AddIcon from '../../images/plus.svg'
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import SpinningBubbles from '../rLoading/SpinningBubbles'


const AddSchool = ({ auth, createSchool, errors, successful, clearErrors, clearSuccess }) => {

    const [schoolState, setSchoolState] = useState({
        title: '',
        location: '',
        website: '',
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
        setSchoolState({ ...schoolState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = e => {
        e.preventDefault()

        const { title, location, website } = schoolState
        const websiteTest = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_.~#?&//=]*)/g

        // VALIDATE
        if (title.length < 3 || location.length < 4 || website.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (title.length > 70) {
            setErrorsState(['Title is too long!'])
            return
        }
        else if (location.length > 120) {
            setErrorsState(['location is too long!'])
            return
        }

        else if (!websiteTest.test(website)) {
            setErrorsState(['Invalid website!'])
            return
        }

        // Create new school object
        const newSchool = {
            title,
            location,
            website
        }

        // Attempt to create
        createSchool(newSchool)

        // Display the progress bar
        setProgress(true)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role === 'Visitor' ?

                <Webmaster auth={auth} /> :

                <div>
                    <NavLink onClick={toggle} className="text-success p-0">
                        <img src={AddIcon} alt="" width="16" height="16" className="mb-1" />
                        &nbsp;School
                    </NavLink>

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Add New School
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

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="title" id="title" placeholder="school title ..." className="mb-3" onChange={onChangeHandler} required />

                                    <Label for="location">
                                        <strong>Location</strong>
                                    </Label>

                                    <Input type="text" name="location" id="location" placeholder="School location ..." className="mb-3" onChange={onChangeHandler} required />

                                    <Label for="website">
                                        <strong>Website</strong>
                                    </Label>

                                    <Input type="text" name="website" id="website" placeholder="School website ..." className="mb-3" onChange={onChangeHandler} required />


                                    <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div>
            :

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
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { createSchool, clearErrors, clearSuccess })(AddSchool)