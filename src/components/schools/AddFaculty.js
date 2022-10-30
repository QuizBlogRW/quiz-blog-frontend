import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { createFaculty } from '../../redux/faculties/faculties.actions';
import AddIcon from '../../images/plus.svg';
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import SpinningBubbles from '../rLoading/SpinningBubbles';


const AddFaculty = ({ auth, createFaculty, facultyLevel, errors, successful, clearErrors, clearSuccess }) => {

    const [facultyState, setFacultyState] = useState({
        title: '',
        school: facultyLevel && facultyLevel.school,
        level: facultyLevel && facultyLevel._id,
        years: []
    })

    // progress
    const [progress, setProgress] = useState(false);

    // Alert
    const [visible, setVisible] = useState(true);
    const onDismiss = () => setVisible(false);

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal);

    const onChangeHandler = e => {
        setErrorsState([])
        clearErrors();
        clearSuccess()
        setFacultyState({ ...facultyState, [e.target.name]: e.target.value });
    };

    const handleSelectYears = (e) => {
        const yearsnbr = []
        for (let i = 1; i <= e.target.value; i++) {
            yearsnbr.push(`Year ${i}`)
        }
        setFacultyState({ ...facultyState, years: yearsnbr });
    }

    const onSubmitHandler = e => {
        e.preventDefault();

        const { title, school, level, years } = facultyState;

        // VALIDATE
        if (title.length < 3 || !years) {
            setErrorsState(['Insufficient info!']);
            return
        }
        else if (title.length > 70) {
            setErrorsState(['Title is too long!']);
            return
        }

        // Create new faculty object
        const newFaculty = {
            title,
            school,
            level,
            years
        };

        // Attempt to create
        createFaculty(newFaculty);

        // Display the progress bar
        setProgress(true)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role === 'Visitor' ?

                <Webmaster auth={auth} /> :

                <div>
                    <NavLink onClick={toggle} className="text-success p-0">
                        <img src={AddIcon} alt="" width="12" height="12" className="mb-1" />
                        &nbsp;Faculty
                    </NavLink>

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Add New Faculty
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

                                    <Input type="text" name="title" id="title" placeholder="Faculty title ..." className="mb-3" onChange={onChangeHandler} required />

                                    <Label for="faculty">
                                        <strong>Learning years</strong>
                                    </Label>

                                    <Input type="select" name="selectYear" onChange={handleSelectYears}>
                                        <option>-- Select --</option>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                    </Input>

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
    );
}

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
});

export default connect(mapStateToProps, { createFaculty, clearErrors, clearSuccess })(AddFaculty);