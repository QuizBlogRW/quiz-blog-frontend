import { useState, useEffect, lazy } from 'react';
import { Button, Col, Row, Form, FormGroup, Input } from 'reactstrap';
import SquareAd from '@/components/adsenses/SquareAd';
import isAdEnabled from '@/utils/isAdEnabled';
import { sendRoomMessage } from '@/redux/slices/contactsSlice';
import { useDispatch } from 'react-redux';
import './contact.css';
import mail from '@/images/mail.svg';
import { useSelector } from 'react-redux';
const ResponsiveHorizontal = lazy(() => import('@/components/adsenses/ResponsiveHorizontal'));
import { notify } from '@/utils/notifyToast';
import { useNavigate } from 'react-router-dom';

const Contact = () => {

    // Redux
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.users);

    const [state, setState] = useState({
        contact_name: '',
        email: '',
        content: ''
    });

    // Lifecycle methods
    useEffect(() => {
        if (user) {
            setState(state => ({ ...state, contact_name: user.name, email: user.email }));
        }
    }, [user]);

    const onChangeHandler = e => {
        const { name, value } = e.target;
        setState(state => ({ ...state, [name]: value }));
    };

    const navigate = useNavigate();

    const onContact = e => {
        e.preventDefault();

        const { contact_name, email, content } = state;

        // VALIDATE
        if (contact_name.length < 3 || email.length < 4) {
            notify('Name and email are required!', 'error');
            return;
        }
        else if (contact_name.length > 100) {
            notify('Name is too long!', 'error');
            return;
        }
        else if (content.length < 2) {
            notify('Insufficient message!', 'error');
            return;
        }
        else if (content.length > 1000) {
            notify('Message is too long!', 'error');
            return;
        }
        // Attempt to contact
        dispatch(sendRoomMessage({
            anonymous: {
                name: contact_name,
                email
            },
            content
        }))
            .unwrap()
            .then(() => user && window.setTimeout(() => navigate('/chat')), 4000);

        // Reset fields
        setState({
            contact_name: '',
            email: '',
            content: ''
        });
    };

    return (
        <div className='contact-section py-0 px-3 py-5 d-flex flex-column align-items-center'>
            <div className="jbtron rounded w-lg-75 px-3 px-sm-4 py-3 py-sm-5 p-2 m-2 m-sm-0 text-center border border-info ">

                <h1 className="display-4 fw-bolder text-center my-4 mb-lg-4" style={{ color: 'var(--accent)' }}>
                    Reach Out Quiz-Blog
                </h1>

                <p className="lead mb-1 mb-lg-4 text-white">
                    Quiz-Blog was created with the intention of offering a diverse range of quizzes and study materials aimed at enhancing students&apos; critical thinking abilities and exam preparedness. Our blog articles span various subjects, serving to deepen students&apos; understanding of their lessons.
                </p>
            </div>

            {isAdEnabled() && <div className='w-100'>
                {/* Google responsive 1 ad */}
                <ResponsiveHorizontal />
            </div>}

            <Row className="mx-sm-2 px-sm-1 mx-md-5 px-md-5 py-lg-5 mt-5 contact d-md-flex justify-content-between">

                <Col sm="6" className="mb-5 px-lg-5">
                    <small className='fw-bolder' style={{ fontSize: '1.1rem', color: 'var(--brand)' }}>
                        More clarification? Feel free to get in touch with us! <span role="img" aria-label="pointing">👉</span>
                    </small>

                    <hr className="my-2" />

                    <Col sm='6' className='contact-img'>
                        <img src={mail} alt="" />
                    </Col>
                </Col>

                <Col sm="6" className="mb-5">
                    <Form onSubmit={onContact}>
                        <FormGroup>
                            <Input type="text" name="contact_name" placeholder="Name" minLength="4" maxLength="30" onChange={onChangeHandler} value={state.contact_name} disabled={user} />
                        </FormGroup>
                        <FormGroup>
                            <Input type="email" name="email" placeholder="Email" onChange={onChangeHandler} value={state.email} disabled={user} />
                        </FormGroup>

                        <FormGroup>
                            <Input type="textarea" name="content" placeholder="Message" rows="5" minLength="3" maxLength="1000" onChange={onChangeHandler} value={state.content} />
                        </FormGroup>
                        <Button style={{ backgroundColor: 'var(--brand)', color: 'var(--accent)' }} className='btn-block'>
                            Send Message
                        </Button>
                    </Form>
                </Col>
            </Row>
            {/* Google square ad */}
            {isAdEnabled() && <Row className='w-100'>
                <Col sm="12">
                    <SquareAd />
                </Col>
            </Row>
            }
        </div>
    );
};

export default Contact;
