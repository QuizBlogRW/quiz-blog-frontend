import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NotFound404.css'; // we'll put the animation styles here

const NotFound404 = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), 100); // smoother appearance
        return () => clearTimeout(timer);
    }, []);

    return (
        <Container className="py-5 notfound-container" style={{ minHeight: '66vh' }}>
            <Row className="h-100 justify-content-center align-items-center">
                <Col xs={12} md={8} lg={6} className="text-center">
                    <Card className="border-0 shadow-sm">
                        <CardBody className={`py-5 fade-slide ${visible ? 'visible' : ''}`} role="alert">
                            {/* SVG illustration */}
                            <div className="mb-3" aria-hidden="true">
                                <svg width="84" height="64" viewBox="0 0 84 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                                    <rect x="2" y="10" width="80" height="42" rx="6" fill="#f6fbfa" stroke="#e6f3f1" />
                                    <path d="M20 36c4-8 20-20 40-12" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" />
                                    <circle cx="60" cy="18" r="6" fill="var(--accent)" />
                                </svg>
                            </div>

                            <h1 className="display-1 mb-2 fw-bold" style={{ color: 'var(--brand)' }}>404</h1>
                            <h2 className="h4 mb-3" style={{ color: 'var(--brand-dark)' }}>Page not found</h2>
                            <p className="mb-4 text-muted">We couldn't find the page you're looking for. It may have been moved or removed.</p>

                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/" className="btn btn-lg btn-primary">Go home</Link>
                                <Link to="/contact" className="btn btn-lg btn-secondary">Contact us</Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default NotFound404;
