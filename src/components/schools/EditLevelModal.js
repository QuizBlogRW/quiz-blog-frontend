import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert, Progress } from 'reactstrap';
import { connect } from 'react-redux';
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { updateLevel } from '../../redux/levels/levels.actions';
import EditIcon from '../../images/edit.svg';
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import SpinningBubbles from '../rLoading/SpinningBubbles';


const EditLevelModal = ({ auth, updateLevel, idToUpdate, editTitle, errors, successful, clearErrors, clearSuccess }) => {

    const [levelState, setLevelState] = useState({
        idToUpdate,
        title: editTitle
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
        setLevelState({ ...levelState, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = e => {
        e.preventDefault();

        const { idToUpdate, title } = levelState;

        // VALIDATE
        if (title.length < 3) {
            setErrorsState(['Insufficient info!']);
            return
        }
        else if (title.length > 70) {
            setErrorsState(['Title is too long!']);
            return
        }

        // update level object
        const updatedLev = {
            idToUpdate,
            title
        };

        // Attempt to create
        updateLevel(updatedLev);

        // Display the progress bar
        setProgress(true)
    }

    return (
        auth.isAuthenticated ?

            auth.user.role === 'Visitor' ?

                <Webmaster /> :

                <div>
                    <NavLink onClick={toggle} className="text-dark p-0">
                        <img src={EditIcon} alt="" width="14" height="14" />
                    </NavLink>
                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Edit Level
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

                                    <Input value={levelState.title} type="text" name="title" id="title" className="mb-3" onChange={onChangeHandler} required />

                                    <Button color="success" style={{ marginTop: '2rem' }} block >Update</Button>

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
                            textColor={'text-danger font-weight-bolder my-5 border rounded'} />
                }
            </div>
    );
}

// Map the question to state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
});

export default connect(mapStateToProps, { updateLevel, clearErrors, clearSuccess })(EditLevelModal);