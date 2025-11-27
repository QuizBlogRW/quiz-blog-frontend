import { Link } from 'react-router-dom';
import { Button, Row, Col, Card } from 'reactstrap';

const MarksStatus = ({ score, qnLength, passMark }) => {
    const percentage = Math.round((score * 100) / qnLength);
    const isPassed = percentage >= passMark;

    return (
        <div className="my-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <Card
                        className="p-4 p-md-5 text-center shadow-sm rounded"
                        style={{ backgroundColor: '#f8f9fa' }}
                    >
                        {!isPassed ? (
                            <>
                                <h5 className="text-danger fw-bold mb-3">
                                    Almost there! Keep pushing!
                                </h5>
                                <p className="text-muted mb-4">
                                    You didn’t pass this time, but every attempt brings you closer to success. Dedicate more time to studying and practicing.
                                </p>
                                <p className="fw-semibold mb-4">
                                    Need guidance or recommended resources? Reach out and we’ll help you level up!
                                </p>
                            </>
                        ) : (
                            <>
                                <h5 className="text-primary fw-bold mb-3">
                                    Fantastic! You passed!
                                </h5>
                                <p className="text-muted mb-4">
                                    Practice makes perfect. Keep going to deepen your understanding and sharpen your skills.
                                </p>
                                <p className="fw-semibold mb-4">
                                    Looking for more resources or tips? Contact us anytime!
                                </p>
                            </>
                        )}

                        <Link to="/contact">
                            <Button
                                color="success"
                                outline
                                className="fw-bold px-4 py-2 rounded-pill"
                                style={{ borderColor: 'var(--accent)', backgroundColor: 'var(--brand)', color: '#fff' }}
                            >
                                Contact Us for Help
                            </Button>
                        </Link>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default MarksStatus;
