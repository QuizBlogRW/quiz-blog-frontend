import React, { useState } from 'react'
import { Container, Row, Col, Button, Form, Input, Alert } from 'reactstrap';
import ResponsiveAd from '../adsenses/ResponsiveAd';
import SquareAd from '../adsenses/SquareAd';

import { connect } from 'react-redux';
import { sendResetLink } from '../../redux/auth/auth.actions';

const ForgotPassword = ({ error, sendResetLink }) => {

    const [fEmail, setFEmail] = useState('');
    const [showSent, setShowSent] = useState(false);
    const [errorsState, setErrorsState] = useState([])

    const onChangeHandler = e => {
        setErrorsState([]);
        setFEmail({ [e.target.name]: e.target.value });
    };

    const onSubmitHandler = e => {
        e.preventDefault();

        // VALIDATE
        const emailTest = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if (!fEmail.email) {
            setErrorsState(['Please provide your email!']);
            return
        }
        else if (!emailTest.test(fEmail.email)) {
            setErrorsState(['Please provide a valid email!']);
            return
        }
        else if (error.id === 'UNEXISTING_EMAIL') {
            setErrorsState([error.msg.msg]);
            return
        }

        // Attempt to send link
        sendResetLink(fEmail);
        setShowSent(true)
    }

    return (
        <Container className="forgot-password mt-4">
            <Row className="mt-5 d-block text-center">

                {showSent ?
                    <h6 className="font-weight-bold my-5 py-5 text-success vh-80">
                        To reset your password click on the link sent to {fEmail.email}!
                    </h6> :

                    <>
                        <h2 className="font-weight-bold my-3">Recover your account here</h2>

                        <small>Provide your email to recover your account</small>
                        {/* Google square ad */}
                        <Row className='w-100'>
                            <Col sm="12" className='w-100'>
                                <SquareAd />
                            </Col>
                        </Row>

                        <Form className="my-4" onSubmit={onSubmitHandler}>

                            {errorsState.length > 0 ?
                                errorsState.map(err =>
                                    <Alert color="danger" key={Math.floor(Math.random() * 1000)} className='border border-warning'>
                                        {err}
                                    </Alert>) :
                                null
                            }

                            <div className="input-group mx-auto search w-50">
                                <Input type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder=" Email ..."
                                    onChange={onChangeHandler} />
                            </div>

                            <Button color="info" size="sm" className="mt-4 d-block mx-auto">Search</Button>

                        </Form>
                        {/* Google responsive 1 ad */}
                        <Row className='w-100'>
                            <Col sm="12" className='w-100'>
                                <div className='w-100'>
                                    <ResponsiveAd />
                                </div>
                            </Col>
                        </Row>
                    </>

                }

            </Row>
        </Container>
    )
}

// Map  state props
const mapStateToProps = state => ({
    error: state.errorReducer
});

export default connect(mapStateToProps, { sendResetLink })(ForgotPassword);