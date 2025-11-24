import { useEffect, useState, lazy, Suspense } from 'react';
import { Col, Row, Form, FormGroup, Input, Button } from 'reactstrap';
import subscribeImg from '@/images/undraw_subscribe.svg';
import QBLoadingSM from '@/utils/rLoading/QBLoadingSM';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToPosts } from '@/redux/slices/subscribersSlice';

const ViewCategories = lazy(() => import('./categories/ViewCategories'));
const SquareAd = lazy(() => import('@/components/adsenses/SquareAd'));

const RightSide = ({ categories }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [subscriber, setSubscriber] = useState({ name: '', email: '' });

    // Pre-fill for logged-in users
    useEffect(() => {
        if (user) {
            setSubscriber({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSubscriber((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubscribe = (e) => {
        e.preventDefault();
        dispatch(subscribeToPosts(subscriber));
        setSubscriber({ name: '', email: '' });
    };

    return (
        <Col sm="4" className="d-flex flex-column justify-content-around">
            {/* Top Square Ad */}
            <Row className="w-100 mb-4">
                <Col sm="12" className="d-flex justify-content-center">
                    <SquareAd />
                </Col>
            </Row>

            {/* Categories (Desktop Only) */}
            <Row className="mb-4 d-none d-lg-flex side-category">
                <Suspense fallback={<QBLoadingSM />}>
                    <ViewCategories categories={categories} />
                </Suspense>
            </Row>

            {/* Responsive Ad */}
            <Row className="w-100 mb-4 d-flex justify-content-center">
                <Col sm="12" className="d-flex justify-content-center">
                    <ResponsiveAd />
                </Col>
            </Row>

            {/* Subscribe Form */}
            <Row className="mb-5">
                <Form
                    onSubmit={handleSubscribe}
                    className="shadow p-4 bg-white rounded text-center"
                >
                    <img
                        src={subscribeImg}
                        alt="Subscribe"
                        className="img-fluid w-50 mb-3 shadow-sm rounded"
                    />
                    <h6 className="fw-bold mb-3">Subscribe for Updates</h6>
                    <FormGroup className="d-flex flex-column gap-3">
                        <Input
                            type="text"
                            name="name"
                            value={subscriber.name}
                            placeholder="Your Name"
                            onChange={handleChange}
                            minLength={4}
                            maxLength={30}
                            required
                        />
                        <Input
                            type="email"
                            name="email"
                            value={subscriber.email}
                            placeholder="Your Email"
                            onChange={handleChange}
                            required
                        />
                        <Button color="success" className="mt-2">
                            Subscribe
                        </Button>
                    </FormGroup>
                </Form>
            </Row>

            {/* Bottom Square Ad */}
            <Row className="w-100 mb-4">
                <Col sm="12" className="d-flex justify-content-center">
                    <SquareAd />
                </Col>
            </Row>
        </Col>
    );
};

export default RightSide;
