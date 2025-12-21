import { useState, useEffect, useContext } from 'react';
import { Button, Modal, ModalBody, Form, FormGroup, Label, Input, NavLink } from 'reactstrap';
import { login } from '@/redux/slices/usersSlice';
import { useSelector, useDispatch } from 'react-redux';
import ReactGA from 'react-ga4';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import { notify } from '@/utils/notifyToast';
import logocirclewhite from '@/images/logocirclewhite.svg';
import avatar from '@/images/avatar1.svg';
import { logRegContext } from '@/contexts/appContexts';

const LoginModal = () => {

    // Context
    const { isOpenL, toggleL, toggleR } = useContext(logRegContext);

    // Redux
    const { isLoading, isAuthenticated } = useSelector(state => state.users);
    const dispatch = useDispatch();

    //properties of the modal
    const [loginState, setLoginState] = useState({ email: '', password: '' });
    const [loginResponse, setLoginResponse] = useState(null); // Corrected typo
    const [confirmLogin, setConfirmLogin] = useState(false);
    const [errorMessage, setErrorMessage] = useState(''); // Add state for error message

    // Lifecycle methods
    useEffect(() => {
        if (loginResponse?.type === 'users/login/rejected') {

            // Extract error message from different possible locations
            const errorMsg = loginResponse.error?.message ||
                loginResponse.payload ||
                loginResponse.error ||
                'Login failed';
            const errCode = loginResponse.error?.code || null;

            if (errCode === 'CONFIRM_ERR') {
                setConfirmLogin(true);
            }

            setErrorMessage(errCode === 'CONFIRM_ERR' ?
                'Already logged in on another device/browser, log them out to use here?' :
                errorMsg);
        }

        // If Authenticated, close isOpenL
        if (isOpenL) {
            if (isAuthenticated) {
                toggleL();

                // Google Analytics
                ReactGA.event({
                    category: 'auth_category',
                    action: 'login_action',
                    label: 'login_label'
                });
            }
        }
    }, [isAuthenticated, isOpenL, toggleL, loginResponse]);

    const onChangeHandler = e => {
        setLoginState({ ...loginState, [e.target.name]: e.target.value });
    };

    const onSubmitHandler = async (e, conf) => {
        e.preventDefault();
        setErrorMessage('');

        const { email, password } = loginState;
        const user = { email, password, confirmLogin: conf };

        // VALIDATE
        if (password.length < 4) {
            notify('Password should be at least 4 characters!', 'error');
            return;
        }

        // Attempt to login
        const res = await dispatch(login(user));
        setLoginResponse(res);
    };
    return (
        <>
            <Modal isOpen={isOpenL} toggle={toggleL} centered={true}>
                <div
                    className="d-flex justify-content-between align-items-center p-2"
                    style={{ backgroundColor: 'var(--brand)', color: '#fff' }}>
                    <img src={logocirclewhite} alt="logo"
                        style={{ maxHeight: '3.2rem', color: 'var(--brand)' }} />
                    <Button className="btn-danger text-uppercase text-red ms-auto me-0"
                        style={{ padding: '0.1rem 0.3rem', fontSize: '.6rem', fontWeight: 'bold' }} onClick={toggleL}>
                        X
                    </Button>
                </div>

                {isLoading ? <QBLoadingSM /> : null}

                {/* icon + title */}
                <div className='d-flex justify-content-center align-items-center pt-3'>
                    <img src={avatar} alt="avatar" style={{ maxHeight: '1.22rem' }} />
                    <h5 className='text-center text-dark fw-bolder align-baseline mb-0 ms-2'>
                        Login
                    </h5>
                </div>

                <ModalBody className='pb-0'>
                    {errorMessage && <div className="alert alert-danger"
                        style={{ fontSize: '.65rem', fontWeight: 900 }}>
                        {errorMessage}</div>}
                    {
                        confirmLogin ?
                            <Button
                                style={{ marginBottom: '2rem', backgroundColor: 'var(--accent)', color: 'var(--brand)', fontWeight: 900 }} block
                                onClick={(e) => onSubmitHandler(e, true)}>
                                Confirm Login
                            </Button> :
                            null
                    }

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
                                <p className="p-2 p-xl-2 fw-bolder" style={{ color: 'var(--brand)' }}>
                                    Forgot password?
                                </p>
                            </a>
                            {confirmLogin ? null :
                                <Button style={{ marginTop: '2rem', backgroundColor: 'var(--brand)', color: 'var(--accent)' }} block>
                                    Login
                                </Button>}
                        </FormGroup>
                    </Form>
                    <div className="d-flex align-items-center justify-content-around">
                        <p className="p-2 p-xl-2 m-0">No account yet?</p>
                        <NavLink onClick={toggleR} className="fw-bolder" style={{ color: 'var(--brand)' }}>
                            Register
                        </NavLink>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default LoginModal;
