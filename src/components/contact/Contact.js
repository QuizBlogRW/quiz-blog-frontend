import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Jumbotron, Button, Col, Row, Form, FormGroup, Input, Alert } from 'reactstrap'
import SquareAd from '../adsenses/SquareAd'
import ResponsiveHorizontal from '../adsenses/ResponsiveHorizontal'
import { sendMsg } from '../../redux/contacts/contacts.actions'
import { clearErrors } from '../../redux/error/error.actions'
import { clearSuccess } from '../../redux/success/success.actions'
import './contact.css'
import mail from '../../../src/images/mail.svg'


const Contact = ({ auth, errors, successful, clearErrors, clearSuccess, sendMsg }) => {

    const currentUser = auth && auth.user
    // Alert
    const [visible, setVisible] = useState(true)
    const onDismiss = () => setVisible(false)

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    const [state, setState] = useState({
        contact_name: '',
        email: '',
        message: ''
    })

    // Lifecycle methods
    useEffect(() => {
        if (currentUser) {
            setState(state => ({ ...state, contact_name: currentUser.name, email: currentUser.email }))
        }
    }, [currentUser])

    const onChangeHandler = e => {
        clearErrors()
        clearSuccess()
        const { name, value } = e.target
        setState(state => ({ ...state, [name]: value }))
    }

    const onContact = e => {
        e.preventDefault()

        const { contact_name, email, message } = state

        // VALIDATE
        if (contact_name.length < 3 || email.length < 4 || message.length < 4) {
            setErrorsState(['Insufficient info!'])
            return
        }
        else if (contact_name.length > 100) {
            setErrorsState(['Name is too long!'])
            return
        }
        else if (message.length > 1000) {
            setErrorsState(['Message is too long!'])
            return
        }

        // Create user object
        const contactMsg = {
            contact_name,
            email,
            message
        }

        // Attempt to contact
        sendMsg(contactMsg)

        window.setTimeout(() => window.location.href = "/contact-chat", 4000)


        // Reset fields
        setState({
            contact_name: '',
            email: '',
            message: ''
        })
    }

    return (
        <div className='contact-section py-0 px-3 py-5'>
            <Jumbotron className="p-2 m-2 m-sm-0 text-center border border-info">

                <h1 className="display-4 font-weight-bold text-center text-success my-4 mb-lg-5">
                    Contact Quiz Blog
                </h1>

                <p className="lead mb-1">
                    Quiz-Blog was developed to provide multi-category quizzes and learning materials helping students to sharpen their minds and prepare for their exams.Its blog articles are related to studies and helps students to understand more from what they learn.
                </p>
            </Jumbotron>

            <Row className="mx-sm-2 px-sm-1 mx-md-5 px-md-5 py-lg-5 mt-5 contact d-md-flex justify-content-center">

                <div className='w-100'>
                    {/* Google responsive 1 ad */}
                    <ResponsiveHorizontal />
                </div>

                <Col sm="6" className="mb-5 px-lg-5">
                    <small className='font-weight-bolder text-info'>
                        Do you need further clarifications? Please contact us! 👉
                    </small>

                    <hr className="my-2" />

                    <Col sm='6' className='contact-img'>
                        <img src={mail} alt="" />
                    </Col>
                </Col>

                <Col sm="6" className="mb-5">
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

                    <Form onSubmit={onContact}>
                        <FormGroup>
                            <Input type="text" name="contact_name" placeholder="Name" minLength="4" maxLength="30" onChange={onChangeHandler} value={state.contact_name} disabled={currentUser} />
                        </FormGroup>
                        <FormGroup>
                            <Input type="email" name="email" placeholder="Email" onChange={onChangeHandler} value={state.email} disabled={currentUser} />
                        </FormGroup>

                        <FormGroup row>
                            <Input type="textarea" name="message" placeholder="Message" rows="5" minLength="10" maxLength="1000" onChange={onChangeHandler} value={state.message} />
                        </FormGroup>
                        <Button color="primary">Send</Button>
                    </Form>

                    {/* Google square ad */}
                    <Row className='w-100'>
                        <Col sm="12" className='w-100'>
                            <SquareAd />
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = state => ({
    errors: state.errorReducer,
    successful: state.successReducer
})

export default connect(mapStateToProps, { clearErrors, clearSuccess, sendMsg })(Contact)