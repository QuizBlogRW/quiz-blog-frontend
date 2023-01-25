import React, { useState, useEffect, useCallback, useContext } from 'react'
import RegisterModal from './RegisterModal'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { login } from '../../redux/auth/auth.actions'
import { clearErrors } from '../../redux/error/error.actions'
import { authContext } from '../../appContexts'
import ReactLoading from "react-loading"

const LoginModal = ({ errors, clearErrors, login, textColor, textContent }) => {
    // context 
    const auth = useContext(authContext)
    const isAuthenticated = auth && auth.isAuthenticated

    //properties of the modal
    const [loginState, setLoginState] = useState({
        // initialy doesn't show
        email: '',
        password: '',
        msg: null
    })

    // loadingLogin
    const [loadingLogin, setLoadingLogin] = useState(false)

    let atHome = false

    //properties of the modal
    const [modalLogin, setModalLogin] = useState(false)

    //showing and hiding modal
    const toggle = useCallback(() => {
        setModalLogin(modalLogin => !modalLogin)
        if (errors && errors.id === 'LOGIN_FAIL') {
            clearErrors()
        }
    }, [errors, clearErrors])

    // Lifecycle methods
    useEffect(() => {
        // Check for login error
        if (errors && errors.id === 'LOGIN_FAIL') {
            setLoginState(loginState => ({ ...loginState, msg: errors.msg && errors.msg }))
            setModalLogin(true)
            setLoadingLogin(false)
        }

        // If Authenticated, Close modalLogin
        if (modalLogin) {
            if (isAuthenticated) {
                toggle()
                setLoadingLogin(false)
            }
        }
    }, [errors, isAuthenticated, modalLogin, toggle])

    const onChangeHandler = e => {
        // Remove errors
        setLoginState({ ...loginState, msg: null, [e.target.name]: e.target.value })
        if (errors && errors.id === 'LOGIN_FAIL') {
            clearErrors()
        }
    }

    const onSubmitHandler = e => {
        e.preventDefault()
        const { email, password } = loginState
        // Create user object
        const user = {
            email,
            password
        }

        // if current page is /, set atHome to true
        window.location.pathname === '/' ? atHome = true : atHome = false

        // Set loading to true
        setLoadingLogin(true)

        // Attempt to login
        login(user, atHome)
    }

    return (
        <div>
            <NavLink onClick={toggle} className={textColor || 'text-warning'}>
                {textContent || 'Login'}
            </NavLink>

            <Modal
                // Set it to the state of modal true or false
                isOpen={modalLogin}
                toggle={toggle}>

                <ModalHeader toggle={toggle} className="bg-primary text-white">
                    Login
                </ModalHeader>

                {
                    // Loading login
                    loadingLogin ?
                        <>
                            <ReactLoading
                                type="spin"
                                color="#641e16"
                                className='mx-auto my-2' />
                            <p className='text-center my-1 text-warning'>Logging you in...</p>
                        </> :
                        null
                }

                <ModalBody>

                    {loginState.msg ? (
                        <Alert color='danger' className='border border-warning'>
                            {loginState.msg}
                        </Alert>) : null}

                    <Form onSubmit={onSubmitHandler}>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input type="email" name="email" placeholder="Email ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="password">Password</Label>
                            <Input type="password" name="password" placeholder="Password ..." className="mb-3" onChange={onChangeHandler} />

                            <Button color="warning" style={{ marginTop: '2rem' }} block>
                                Login
                            </Button>
                        </FormGroup>
                    </Form>

                    <a href="forgot-password">
                        <p className="p-2">Forgot password?</p>
                    </a>
                    <div className="d-flex">
                        <p className="p-2">No account yet?</p>
                        <RegisterModal />
                    </div>

                </ModalBody>
            </Modal>
        </div>
    )
}

// Map  state props
const mapStateToProps = state => ({
    errors: state.errorReducer
})

export default connect(mapStateToProps, { login, clearErrors })(LoginModal)