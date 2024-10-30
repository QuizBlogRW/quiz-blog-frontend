import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from "react-router-dom"
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap'
import { register } from '../../redux/slices/authSlice'
import { clearErrors } from '../../redux/slices/errorSlice'
import { useSelector, useDispatch } from "react-redux"
import { authContext } from '../../appContexts'

import logocirclewhite from '../../../src/images/logocirclewhite.svg'
import avatar from '../../../src/images/avatar1.svg'
import QBLoadingSM from '../rLoading/QBLoadingSM'
import Notification from '../../utils/Notification'

const RegisterModal = ({ isOpenR, toggleR, toggleL }) => {

    const errors = useSelector(state => state.error)
    const isLoading = useSelector(state => state.auth.isLoading)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    // Errors state on form
    const [errorsState, setErrorsState] = useState([])

    // context
    const auth = useContext(authContext)
    const isAuthenticated = auth && auth.isAuthenticated

    const [registerState, setRegisterState] = useState({
        name: '',
        email: '',
        password: ''
    })

    // Lifecycle methods
    useEffect(() => {

        // If Authenticated, Close isOpenR
        if (isOpenR) {
            if (isAuthenticated) {
                toggleR()
            }
        }

    }, [errors, isAuthenticated, isOpenR, toggleR])

    const onChangeHandler = e => {
        setErrorsState([])
        dispatch(clearErrors())
        setRegisterState({ ...registerState, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = (e) => {
        e.preventDefault()

        const { name, email, password } = registerState

        // VALIDATE
        if (name.length < 3) {
            setErrorsState(['Name should be at least 3 characters!'])
            return
        }
        else if (password.length < 4) {
            setErrorsState(['Password should be at least 4 characters!'])
            return
        }

        // Create user object
        const newUser = {
            name,
            email,
            password
        }

        // Attempt to register
        dispatch(register(newUser))
            .then(() => {
                localStorage.setItem('emailForOTP', email)
                navigate('/verify', { state: { email } })
            })
    }

    return (
        <div>
            <Modal isOpen={isOpenR} toggle={toggleR} centered={true}>
                <div className="d-flex justify-content-between align-items-center p-2" style={{ backgroundColor: "#157A6E", color: "#fff" }}>
                    <img src={logocirclewhite} alt="logo" style={{ maxHeight: "3.2rem", color: "#157A6E" }} />
                    <Button className="btn-danger text-uppercase text-red" style={{ padding: "0.1rem 0.3rem", fontSize: ".6rem", fontWeight: "bold" }} onClick={toggleR}>
                        X
                    </Button>
                </div>

                {isLoading ? <QBLoadingSM /> : null}

                {/* icon + title */}
                <div className='d-flex justify-content-center align-items-center pt-3'>
                    <img src={avatar} alt="avatar" style={{ maxHeight: "1.22rem" }} />
                    <h5 className='text-center text-dark fw-bolder align-baseline mb-0 ms-2'>Register</h5>
                </div>

                <ModalBody className='pb-0'>

                    <Notification errorsState={errorsState} progress={null} initFn="register" />
                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>
                            <Label for="name" className="mb-1 fw-bolder">
                                Name
                            </Label>
                            <Input type="text" name="name" placeholder="Name here ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="email" className="mb-1 fw-bolder">
                                Email
                            </Label>
                            <Input type="email" name="email" placeholder="E-mail here ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="password" className="mb-1 fw-bolder">
                                Password
                            </Label>
                            <Input type="password" name="password" placeholder="Password here ..." className="mb-3" onChange={onChangeHandler} />

                            <Button style={{ marginTop: '2rem', backgroundColor: "#157A6E" }} block>
                                Register
                            </Button>
                        </FormGroup>
                    </Form>

                    <div className="d-flex">
                        <p className="p-2 mb-0">Having an account?</p>
                        <NavLink onClick={toggleL} className="fw-bolder" style={{ color: "#157A6E" }}>
                            Login
                        </NavLink>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default RegisterModal