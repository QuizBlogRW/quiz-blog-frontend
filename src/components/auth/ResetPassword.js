import React, { useState } from 'react'
import { Container, Row, Button, Form, Input, Alert } from 'reactstrap';
import ResponsiveAd from '../adsenses/ResponsiveAd';

import SquareAd from '../adsenses/SquareAd';

import { connect } from 'react-redux';
import { sendNewPassword } from '../../redux/auth/auth.actions';

const ResetPassword = ({ sendNewPassword }) => {

    const [newPasswords, setNewPasswords] = useState({
        password: '',
        password1: ''
    });
    const [showResetSuccess, setShowResetSuccess] = useState(false);
    const [errorsState, setErrorsState] = useState([])

    const onChangeHandler = e => {
        setErrorsState([]);
        setNewPasswords({ ...newPasswords, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = e => {
        e.preventDefault();

        const { password, password1 } = newPasswords;

        // Simple validation
        // const pswdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!password || !password1) {
            setErrorsState(['Fill empty fields!']);
            return
        }

        // else if (!pswdRegex.test(password)) {
        //     setErrorsState(['Password should be greater than 7 and having special characters, number, and uppercase and lowercase letters']);
        //     return
        // }

        else if (password !== password1) {
            setErrorsState(['Passwords must match!']);
            return
        }

        // Exploit token and userId from URL
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const token = urlParams.get('token')
        const userId = urlParams.get('id')

        // Create new pswd object
        const updatePsw = {
            userId,
            token,
            password
        };

        // Attempt to reset
        sendNewPassword(updatePsw);
        setShowResetSuccess(true)
    }

    return (

        <Container className="forgot-password mt-4">
            <Row className="mt-5 d-block text-center">

                {showResetSuccess ?
                    <h6 className="font-weight-bold my-5 py-5 text-success">
                        Account reset successful, Please Login!
                    </h6> :

                    <>
                        <h2 className="font-weight-bold my-3">Change your password here</h2>

                        <small>Provide matching passwords to reset your account</small>

                        {/* Google square ad */}
                        <SquareAd />
                        <Form className="my-4" onSubmit={onSubmitHandler}>

                            {errorsState.length > 0 ?
                                errorsState.map(err =>
                                    <Alert color="danger" key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                        {err}
                                    </Alert>) :
                                null
                            }

                            <div className="input-group mx-auto my-5 search w-50">
                                <Input type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder=" Create password ..."
                                    onChange={onChangeHandler} />
                            </div>

                            <div className="input-group mx-auto my-5 search w-50">
                                <Input type="password"
                                    name="password1"
                                    className="form-control"
                                    placeholder=" Verify password ..."
                                    onChange={onChangeHandler} />
                            </div>

                            <Button color="info" size="sm" className="mt-4 d-block mx-auto">Reset</Button>

                        </Form>
                        {/* Google responsive 1 ad */}
                        <ResponsiveAd />
                    </>

                }

            </Row>
        </Container>
    )
}

export default connect(null, { sendNewPassword })(ResetPassword);