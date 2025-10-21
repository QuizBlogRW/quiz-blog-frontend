import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, CardBody } from 'reactstrap';
import { Link } from 'react-router-dom';

const NotFound404 = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 60);
        return () => clearTimeout(t);
    }, []);

    const contentStyle = {
        transition: 'transform 420ms cubic-bezier(.2,.8,.2,1), opacity 420ms ease',
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        opacity: visible ? 1 : 0,
    };

    return (
        <Container className="py-5" style={{ minHeight: '66vh' }}>
            <Row className="h-100 justify-content-center align-items-center">
                <Col xs={12} md={8} lg={6} className="text-center">
                    <Card className="border-0 shadow-sm">
                        <CardBody className="py-5" style={contentStyle}>
                            {/* lightweight inline SVG illustration */}
                            <div className="mb-3" aria-hidden="true">
                                <svg width="84" height="64" viewBox="0 0 84 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
                                    <rect x="2" y="10" width="80" height="42" rx="6" fill="#f6fbfa" stroke="#e6f3f1" />
                                    <path d="M20 36c4-8 20-20 40-12" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" />
                                    <circle cx="60" cy="18" r="6" fill="var(--accent)" />
                                </svg>
                            </div>

                            <h1 className="display-1 mb-2" style={{ fontWeight: 800, color: 'var(--brand)' }}>404</h1>
                            <h2 className="h4 mb-3" style={{ color: 'var(--brand-dark)' }}>Page not found</h2>
                            <p className="mb-4" style={{ color: '#556' }}>We couldn't find the page you're looking for. It may have been moved or removed.</p>
                            <div className="d-flex justify-content-center gap-3">
                                <Link to="/" className="btn btn-lg" style={{ backgroundColor: 'var(--brand)', borderColor: 'var(--brand)', color: 'var(--accent)' }}>Go home</Link>
                                <Link to="/contact" className="btn btn-lg" style={{ backgroundColor: 'var(--accent)', borderColor: 'var(--accent)', color: 'var(--brand)' }}>Contact us</Link>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default NotFound404
