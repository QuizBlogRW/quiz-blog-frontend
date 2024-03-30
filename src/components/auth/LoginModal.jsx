import React, { useState, useEffect, useContext } from 'react'
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { login } from '../../redux/slices/authSlice'
import { clearErrors } from '../../redux/slices/errorSlice'
import { useSelector, useDispatch } from "react-redux"
import { authContext } from '../../appContexts'
import ReactGA from "react-ga4"
import logocirclewhite from '../../../src/images/logocirclewhite.svg'
import avatar from '../../../src/images/avatar1.svg'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import Notification from '../../utils/Notification'

const LoginModal = ({ isOpenL, toggleL, toggleR }) => {

    const isLoading = useSelector(state => state.auth.isLoading)
    const errors = useSelector(state => state.error)

    const dispatch = useDispatch()

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    // context 
    const auth = useContext(authContext)
    const isAuthenticated = auth && auth.isAuthenticated

    //properties of the modal
    const [loginState, setLoginState] = useState({
        email: '',
        password: ''
    })

    const [confirmLogin, setConfirmLogin] = useState(false)

    let atHome = false

    // Lifecycle methods
    useEffect(() => {

        console.log(errors)

        if ((errors && errors.id === 'login') && (errors && errors.msg && errors.msg.id === 'CONFIRM_ERR')) {
            setConfirmLogin(true)
        }

        // If Authenticated, close isOpenL
        if (isOpenL) {
            if (isAuthenticated) {
                toggleL()

                // Google Analytics
                ReactGA.event({
                    category: 'auth_category',
                    action: 'login_action',
                    label: 'login_label'
                })
            }
        }
    }, [isAuthenticated, isOpenL, toggleL])

    const onChangeHandler = e => {
        dispatch(clearErrors())
        setLoginState({ ...loginState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = (e, confirmLogin) => {
        e.preventDefault()

        const { email, password } = loginState
        const user = { email, password, confirmLogin }

        // VALIDATE
        if (password.length < 4) {
            setErrorsState(['Password should be at least 4 characters!'])
            return
        }

        // if current page is /, set atHome to true
        window.location.pathname === '/' ? atHome = true : atHome = false

        // Attempt to login
        dispatch(clearErrors())
        dispatch(login(user, atHome))
    }

    return (
        <>
            <Modal isOpen={isOpenL} toggle={toggleL} centered={true}>
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    <img src={logocirclewhite} alt="logo" style={{ maxHeight: "3.2rem", color: "#157A6E" }} />
                    <Button className="btn-danger text-uppercase text-red ms-auto me-0" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggleL}>
                        X
                    </Button>
                </div>

                {isLoading ? <QBLoadingSM /> : null}

                {/* icon + title */}
                <div className='d-flex justify-content-center align-items-center pt-3'>
                    <img src={avatar} alt="avatar" style={{ maxHeight: "1.22rem" }} />
                    <h5 className='text-center text-dark fw-bolder align-baseline mb-0 ms-2'>Login</h5>
                </div>

                <ModalBody className='pb-0'>
                    {
                        confirmLogin ?
                            <Button
                                style={{ marginBottom: '2rem', backgroundColor: "#ffc107", color: "#157A6E", fontWeight: 900 }} block
                                onClick={(e) => onSubmitHandler(e, true)}>
                                Confirm Login
                            </Button> :
                            null
                    }

                    <Notification errorsState={errorsState} progress={null} initFn='login' />

                    <Form onSubmit={(e) => onSubmitHandler(e, false)}>
                        <FormGroup>
                            <Label for="email" className="mb-2 fw-bolder">
                                Email
                            </Label>
                            <Input type="email" name="email" placeholder="E-mail here ..." className="mb-4" onChange={onChangeHandler} />
                            <Label for="password" className="mb-2 fw-bolder">
                                Password
                            </Label>
                            <Input type="password" name="password" placeholder="Password here ..." className="mb-4" onChange={onChangeHandler} />
                            <a href="forgot-password">
                                <p className="p-2 p-xl-2 fw-bolder" style={{ color: "#157A6E" }}>
                                    Forgot password?
                                </p>
                            </a>
                            {confirmLogin ? null :
                                <Button style={{ marginTop: '2rem', backgroundColor: "#157A6E" }} block>
                                    Login
                                </Button>}
                        </FormGroup>
                    </Form>
                    <div className="d-flex justify-content-center align-items-center">
                        <p className="p-2 p-xl-2 m-0">No account yet?</p>
                        <NavLink onClick={toggleR} className="fw-bolder" style={{ color: "#157A6E" }}>
                            Register
                        </NavLink>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default LoginModal