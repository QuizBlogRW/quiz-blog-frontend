import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, NavLink } from 'reactstrap';
import { getUsers } from '../../redux/auth/auth.actions'
import ReactLoading from "react-loading";
import { Link } from "react-router-dom";
import LoginModal from '../auth/LoginModal'
import { connect } from 'react-redux';
import SpinningBubbles from '../rLoading/SpinningBubbles';

const ChallengeeModal = ({ auth, users, getUsers, quizID }) => {

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    //properties of the modal
    const [modalChallenge, setModalChallenge] = useState(false)

    //showing and hiding modal
    const toggleChallenge = () => setModalChallenge(!modalChallenge);

    return (

        <div>
            <NavLink onClick={toggleChallenge} className="text-success p-0">
                <Button className="btn btn-outline-primary mt-3">
                    Challenge
                </Button>
            </NavLink>

            <Modal
                // Set it to the state of modal true or false
                isOpen={modalChallenge}
                toggle={toggleChallenge}
            >

                <ModalHeader toggle={toggleChallenge} className="bg-primary text-white">
                    Choose someone to challenge
                </ModalHeader>

                {auth.isAuthenticated ?
                    <ModalBody>
                        {users.isLoading ?
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "40vh" }}>
                                <ReactLoading type="spinningBubbles" color="#33FFFC" />
                            </div> :
                            <div>
                                {users && users.users.map(user => (
                                    <Link to={`/challenge/${quizID}/${user._id}`} key={user._id}>
                                        <Button size="lg" className="my-1" block style={{ backgroundColor: "#ffc107" }}>
                                            <small className="d-block text-uppercase mb-0">{user.name}</small>
                                            {/* <small className="d-block text-warning">{user.email}</small> */}
                                        </Button>
                                    </Link>))}
                            </div>}
                    </ModalBody> :

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
                    </div>}

            </Modal>
        </div>);
}

// Map  state props
const mapStateToProps = state => ({
    users: state.authReducer
})
export default connect(mapStateToProps, { getUsers })(ChallengeeModal);