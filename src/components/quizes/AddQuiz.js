import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap';
import AddIcon from '../../images/plus.svg';
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux';
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import { createQuiz } from '../../redux/quizes/quizes.actions';
import SpinningBubbles from '../rLoading/SpinningBubbles';

const AddQuiz = ({ auth, createQuiz, category, errors, successful, clearErrors, clearSuccess }) => {

    const [quizState, setQuizState] = useState({
        name: '',
        description: ''
    })

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
        clearErrors()
        clearSuccess()
        setQuizState({ ...quizState, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = e => {
        e.preventDefault();

        const { name, description } = quizState;

        // VALIDATE
        if (name.length < 4 || description.length < 4) {
            setErrorsState(['Insufficient info!']);
            return
        }
        else if (name.length > 70) {
            setErrorsState(['Title is too long!']);
            return
        }
        else if (description.length > 120) {
            setErrorsState(['Description is too long!']);
            return
        }

        // Create new Quiz object
        const newQuiz = {
            title: name,
            description,
            category: category._id,
            created_by: auth.isLoading === false ? auth.user._id : null
        };

        // Attempt to create
        createQuiz(newQuiz);
    }

    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <NavLink onClick={toggle} className="text-success p-0">
                        <img src={AddIcon} alt="" width="10" height="10" className="mb-1" />
                        &nbsp;Add Quiz
                    </NavLink>

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">
                            Add {category.title} Quiz
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

                                    <Label for="name">
                                        <strong>Title</strong>
                                    </Label>

                                    <Input type="text" name="name" id="name" placeholder="Quiz name ..." className="mb-3" onChange={onChangeHandler} />

                                    <Label for="description">
                                        <strong>Description</strong>
                                    </Label>

                                    <Input type="text" name="description" id="description" placeholder="Quiz description ..." className="mb-3" onChange={onChangeHandler} />

                                    <Button color="success" style={{ marginTop: '2rem' }} block >Add</Button>

                                </FormGroup>

                            </Form>
                        </ModalBody>
                    </Modal>
                </div> :

                <Webmaster auth={auth} /> :

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

// Map  state props
const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
});

export default connect(mapStateToProps, { createQuiz, clearErrors, clearSuccess })(AddQuiz);