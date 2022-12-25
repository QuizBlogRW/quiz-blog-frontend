import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import LoginModal from '../auth/LoginModal'
import Webmaster from '../webmaster/Webmaster'
import { connect } from 'react-redux';
import { updateUser } from '../../redux/auth/auth.actions'
import EditIcon from '../../images/edit.svg';
import SpinningBubbles from '../rLoading/SpinningBubbles';

const EditUser = ({ uId, auth, uName, uRole, uEmail, updateUser }) => {

    const [userState, setUserState] = useState({
        uId,
        name: uName,
        role: uRole,
        email: uEmail
    })

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    //properties of the modal
    const [modal, setModal] = useState(false)

    //showing and hiding modal
    const toggle = () => setModal(!modal);

    const onChangeHandler = e => {
        setUserState({ ...userState, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = e => {
        e.preventDefault();

        const { uId, name, role, email } = userState;

        // VALIDATE
        if (name.length < 4 || role.length < 4 || email.length < 4) {
            setErrorsState(['Insufficient info!']);
            return
        }
        else if (name.length > 30) {
            setErrorsState(['Name is too long!']);
            return
        }
        else if (role === '') {
            setErrorsState(['Role is required!']);
            return
        }

        // Create new User object
        const updatedUser = {
            uId,
            name,
            role,
            email
        };

        // Attempt to update
        updateUser(updatedUser);

        // close the modal
        if (modal) {
            toggle();
        }
    }
    return (
        auth.isAuthenticated ?

            auth.user.role !== 'Visitor' ?

                <div>
                    <img src={EditIcon} onClick={toggle} alt="" width="16" height="16" className="mr-3" />

                    <Modal
                        // Set it to the state of modal true or false
                        isOpen={modal}
                        toggle={toggle}
                    >

                        <ModalHeader toggle={toggle} className="bg-primary text-white">Edit User</ModalHeader>

                        <ModalBody>

                            {errorsState.length > 0 ?
                                errorsState.map(err =>
                                    <Alert color="danger" key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                        {err}
                                    </Alert>) :
                                null
                            }

                            <Form onSubmit={onSubmitHandler}>

                                <FormGroup>

                                    <Label for="name">
                                        <strong>Name</strong>
                                    </Label>

                                    <Input type="text" name="name" id="name" placeholder="User name ..." className="mb-3" onChange={onChangeHandler} value={userState.name} />

                                    <Label for="role">
                                        <strong>Role</strong>
                                    </Label>

                                    <Input type="select" name="role" placeholder="Category role ..." className="mb-3" onChange={onChangeHandler} value={userState.role}>
                                        <option>SuperAdmin</option>
                                        <option>Admin</option>
                                        <option>Creator</option>
                                        <option>Visitor</option>
                                    </Input>

                                    <Label for="email">
                                        <strong>Email</strong>
                                    </Label>

                                    <Input type="email" name="email" id="email" placeholder="Category email ..." className="mb-3" onChange={onChangeHandler} value={userState.email} />

                                    <Button color="success" style={{ marginTop: '2rem' }} block>
                                        Update
                                    </Button>

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

export default connect(null, { updateUser })(EditUser);