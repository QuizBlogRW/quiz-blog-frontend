import React, { useState, useEffect, useContext, lazy, Suspense } from 'react'
import { Button, Col, Row, Form, FormGroup, Input, Alert } from 'reactstrap'
import SquareAd from '../adsenses/SquareAd'
import { sendMsg } from '../../redux/slices/contactsSlice'
import { clearErrors } from '../../redux/slices/errorSlice'
import { clearSuccess } from '../../redux/slices/successSlice'
import { useSelector, useDispatch } from "react-redux"
import './contact.css'
import mail from '../../../src/images/mail.svg'
import { currentUserContext, socketContext, onlineListContext } from '../../appContexts'
import { apiURL, devApiURL, qbURL } from '../../redux/configHelpers'

const ResponsiveHorizontal = lazy(() => import('../adsenses/ResponsiveHorizontal'))

const serverUrl = process.env.NODE_ENV === 'development' ? devApiURL : (qbURL || apiURL)

// Socket Settings
import io from 'socket.io-client'

const Contact = () => {

    // Redux
    const errors = useSelector(state => state.error)
    const successful = useSelector(state => state.success)
    const dispatch = useDispatch()

    const currentUser = useContext(currentUserContext)
    const socket = React.useMemo(() => io.connect(serverUrl), [])

    // Socket join on user load
    const [onlineList, setOnlineList] = useState([])

    useEffect(() => {
        if (currentUser && currentUser.email) {

            // Telling the server that a user has joined
            socket.emit('frontJoinedUser', { user_id: currentUser._id, username: currentUser && currentUser.name, email: currentUser && currentUser.email, role: currentUser && currentUser.role });

            socket.on('onlineUsersList', onlineUsers => {
                setOnlineList(onlineUsers)
            });
        }
    }, [currentUser, socket])

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
        dispatch(clearErrors())
        dispatch(clearSuccess())
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
        dispatch(sendMsg(contactMsg))

        // Emit to the server that a new message has been sent
        socket.emit('contactMsgClient', contactMsg)

        window.setTimeout(() => window.location.href = "/contact-chat", 4000)

        // Reset fields
        setState({
            contact_name: '',
            email: '',
            message: ''
        })
    }

    return (
        <socketContext.Provider value={socket}>
            <onlineListContext.Provider value={onlineList}>
                <div className='contact-section py-0 px-3 py-5'>
                    <div className="jbtron rounded px-3 px-sm-4 py-3 py-sm-5 p-2 m-2 m-sm-0 text-center border border-info">

                        <h1 className="display-4 fw-bolder text-center my-4 mb-lg-4" style={{ color: "#ffc107" }}>
                            Reach Out Quiz-Blog
                        </h1>

                        <p className="lead mb-1 mb-lg-4 text-white">
                            Quiz-Blog was created with the intention of offering a diverse range of quizzes and study materials aimed at enhancing students' critical thinking abilities and exam preparedness. Our blog articles span various subjects, serving to deepen students' understanding of their lessons.
                        </p>
                    </div>

                    <Row className="mx-sm-2 px-sm-1 mx-md-5 px-md-5 py-lg-5 mt-5 contact d-md-flex justify-content-center">

                        <div className='w-100'>
                            {/* Google responsive 1 ad */}
                            {process.env.NODE_ENV !== 'development' ? <ResponsiveHorizontal /> : null}
                        </div>

                        <Col sm="6" className="mb-5 px-lg-5">
                            <small className='fw-bolder' style={{ fontSize: '1.1rem', color: '#157A6E' }}>
                                Require more clarification? Feel free to get in touch with us! <span role="img" aria-label="pointing">👉</span>
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
                            {errors.id && errors.id === 'ADD_CONTACT_FAIL' ?
                                <Alert isOpen={visible} toggle={onDismiss} color='danger'>
                                    <small>{errors.msg && errors.msg.msg}</small>
                                </Alert> :

                                successful.id && successful.id === 'ADD_CONTACT' ?
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

                                <FormGroup>
                                    <Input type="textarea" name="message" placeholder="Message" rows="5" minLength="10" maxLength="1000" onChange={onChangeHandler} value={state.message} />
                                </FormGroup>
                                <Button style={{ backgroundColor: '#157A6E', color: '#ffc107' }} className='btn-block'>
                                    Send Message
                                </Button>
                            </Form>

                            {/* Google square ad */}
                            <Row className='w-100'>
                                <Col sm="12">
                                    {process.env.NODE_ENV !== 'development' ? <SquareAd /> : null}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </onlineListContext.Provider>
        </socketContext.Provider>
    )
}

export default Contact