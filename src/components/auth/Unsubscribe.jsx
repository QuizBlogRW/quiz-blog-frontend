import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { deleteSubscriber } from '@/redux/slices/subscribersSlice';
import { useDispatch } from 'react-redux';
import NotAuthenticated from '@/components/auth/NotAuthenticated';

const Unsubscribe = () => {

    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const [unsubscribed, setUnsubscribed] = useState(false);

    const onUnsubscribe = e => {
        e.preventDefault();

        // Attempt unsubscribe
        dispatch(deleteSubscriber(user?.email));
        setUnsubscribed(true);
    };

    return (

        isAuthenticated ?

            <Container className="forgot-password mt-4">
                <Row className="mt-5 d-block text-center">

                    {unsubscribed ?
                        <h6 className="fw-bolder my-5 py-5 text-success">
                            You have unsubscribed from Quiz-Blog! you will no longer receive updates.
                        </h6> :

                        <h6 className="fw-bolder my-5 py-5 text-dark">
                            Are sure, you want to unsubscribe? click here to &nbsp;
                            <Link to="#/" onClick={onUnsubscribe}>unsubscribe</Link>
                        </h6>
                    }

                </Row>
            </Container> :
            <NotAuthenticated />
    );
};

export default Unsubscribe;