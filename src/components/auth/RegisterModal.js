import React, { useState, useEffect, useCallback, useContext } from 'react'
import LoginModal from './LoginModal'
import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, NavLink, Alert } from 'reactstrap'
import { connect } from 'react-redux'
import { register } from '../../redux/auth/auth.actions'
import { clearErrors } from '../../redux/error/error.actions'
import { authContext } from '../../appContexts'
import ReactLoading from "react-loading"

const RegisterModal = ({ errors, clearErrors, register }) => {
    // context
    const auth = useContext(authContext)
    const isAuthenticated = auth && auth.isAuthenticated

    const [registerState, setRegisterState] = useState({
        // initialy doesn't show
        name: '',
        email: '',
        password: '',
        msg: null
    })

    // loadingRegister
    const [loadingRegister, setLoadingRegister] = useState(false)

    let atHome = false

    //properties of the modal
    const [modalReg, setModalReg] = useState(false)

    //showing and hiding modal
    const toggle = useCallback(() => {
        setModalReg(modalReg => !modalReg)
        if (errors && errors.id === 'REGISTER_FAIL') {
            clearErrors()
        }
    }, [errors, clearErrors])


    // Lifecycle methods
    useEffect(() => {
        // Check for register error
        if (errors && errors.id === 'REGISTER_FAIL') {
            setRegisterState(registerState => ({ ...registerState, msg: errors.msg && errors.msg }))
            setModalReg(true)
            setLoadingRegister(false)
        }

        // If Authenticated, Close modalReg
        if (modalReg) {
            if (isAuthenticated) {
                toggle()
                setLoadingRegister(false)
            }
        }
    }, [errors, isAuthenticated, modalReg, toggle])

    const onChangeHandler = e => {
        // Remove errors
        setRegisterState({ ...registerState, msg: null, [e.target.name]: e.target.value })
        if (errors && errors.id === 'REGISTER_FAIL') {
            clearErrors()
        }
    }

    const onSubmitHandler = e => {
        e.preventDefault()
        const { name, email, password } = registerState
        // Create user object
        const newUser = {
            name,
            email,
            password
        }

        // if current page is /, set atHome to true
        window.location.pathname === '/' ? atHome = true : atHome = false

        // Set loading to true
        setLoadingRegister(true)

        // Attempt to register
        register(newUser, atHome)
    }

    return (
        <div>
            <NavLink onClick={toggle} className="text-warning">Register</NavLink>

            <Modal isOpen={modalReg} toggle={toggle}>
                <ModalHeader toggle={toggle} className="bg-primary text-white">
                    Register
                </ModalHeader>

                {
                    // Register loading
                    loadingRegister ?
                        <>
                            <ReactLoading
                                type="spin"
                                color="#641e16"
                                className='mx-auto my-2' />
                            <p className='text-center my-1 text-warning'>Registering you in...</p>
                        </> :
                        null
                }

                <ModalBody>

                    {registerState.msg ? (
                        <Alert color='danger' className='border border-warning'>{registerState.msg}</Alert>) : null}

                    <Form onSubmit={onSubmitHandler}>

                        <FormGroup>
                            <Label for="name">Name</Label>
                            <Input type="text" name="name" placeholder="Name ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="email">Email</Label>
                            <Input type="email" name="email" placeholder="Email ..." className="mb-3" onChange={onChangeHandler} />

                            <Label for="password">Password</Label>
                            <Input type="password" name="password" placeholder="Password ..." className="mb-3" onChange={onChangeHandler} />

                            <Button color="dark" style={{ marginTop: '2rem' }} block>
                                Register
                            </Button>

                        </FormGroup>

                    </Form>

                    <div className="d-flex">
                        <p className="p-2">Having account?</p>
                        <LoginModal />
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

export default connect(mapStateToProps, { register, clearErrors })(RegisterModal)