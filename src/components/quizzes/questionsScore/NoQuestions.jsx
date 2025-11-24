import { Container, Row, Button, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

const NoQuestions = () => {
    return (
        <Container className="d-flex flex-column justify-content-center align-items-center my-5">
            <Row className="text-center w-100">
                <Col xs="12" className="py-5 border border-primary rounded bg-light shadow-sm">
                    <h1 className="text-danger fw-bolder display-1 mb-3">404</h1>
                    <h4 className="mb-4">No questions available!</h4>
                    <Button color="success" className="px-4 py-2">
                        <Link to="/dashboard" className="text-white text-decoration-none">
                            Back
                        </Link>
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default NoQuestions;
