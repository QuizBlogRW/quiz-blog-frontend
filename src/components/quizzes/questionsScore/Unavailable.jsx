import { Button, Card, CardBody } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const Unavailable = ({ title, link, more }) => {
    const navigate = useNavigate();

    const handleGoBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100 px-3" style={{ backgroundColor: '#f3f3f2' }}>
            <Card
                className="shadow-lg border-0 text-center"
                style={{ maxWidth: '500px', width: '100%' }}
            >
                <CardBody className="p-4 p-md-5">
                    {/* Icon */}
                    <div
                        className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#ffc107',
                            boxShadow: '0 4px 12px rgba(255, 193, 7, 0.3)',
                        }}
                    >
                        <i className="fa fa-exclamation-triangle" style={{ fontSize: '2.5rem', color: '#157a6e' }}></i>
                    </div>

                    {/* Title */}
                    <h3 className="fw-bold mb-3" style={{ color: '#157a6e' }}>
                        {title || 'Content Unavailable'}
                    </h3>

                    {/* Message */}
                    <p className="text-muted mb-4">
                        The content you&apos;re looking for is not currently available.
                        {more && ` Please explore our ${more} instead.`}
                    </p>

                    {/* Action Buttons */}
                    <div className="d-grid gap-3">
                        {link && more && (
                            <Button
                                color="warning"
                                size="lg"
                                className="fw-bold py-3"
                                tag="a"
                                href={link}
                                style={{
                                    backgroundColor: '#ffc107',
                                    border: 'none',
                                    color: '#157a6e'
                                }}
                            >
                                <i className="fa fa-search me-2"></i>
                                Browse {more}
                            </Button>
                        )}

                        <Button
                            color="secondary"
                            outline
                            size="lg"
                            className="fw-bold py-3"
                            onClick={handleGoBack}
                            style={{
                                borderColor: '#C2C5BB',
                                color: '#157a6e'
                            }}
                        >
                            <i className="fa fa-arrow-left me-2"></i>
                            Go Back
                        </Button>
                    </div>

                    {/* Help Text */}
                    <div className="mt-4 pt-3 border-top">
                        <small className="text-muted">
                            <i className="fa fa-info-circle me-1"></i>
                            Need help? Contact support or try refreshing the page
                        </small>
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default Unavailable;