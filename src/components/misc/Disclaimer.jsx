import SquareAd from '@/components/adsenses/SquareAd';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';

import {
    Row,
    Col,
    Card,
    CardBody,
    Alert
} from 'reactstrap';

import { formatDate } from '@/utils/dateFormat';

const Disclaimer = () => {
    const lastUpdated = formatDate(new Date());

    return (
        <div className="py-0 px-3 py-lg-5 w-100">

            <div className="mt-4 mb-3 text-center">
                <h1 className="fw-bolder" style={{ color: 'var(--brand)' }}>
                    Disclaimer
                </h1>
                <p className="mb-2" style={{ color: '#1a1a1a', opacity: 0.85 }}>
                    Important information about our terms of use and liability limitations.
                </p>
                <p className="mb-2" style={{ color: '#1a1a1a', opacity: 0.85 }}>
                    This page explains what you can expect from Quiz-Blog and what we expect from users.
                </p>
                <small className="fw-bolder" style={{ color: 'var(--brand)' }}>
                    Need clarification? Contact us at{' '}
                    <a
                        href="mailto:quizblog.rw@gmail.com"
                        style={{ color: 'var(--brand)' }}
                    >
                        <u style={{ textDecorationThickness: '2px' }}>quizblog.rw@gmail.com</u>
                    </a>
                    .
                </small>
                <hr className="my-3" style={{ height: '2px', borderWidth: 0, backgroundColor: 'var(--brand)' }} />
            </div>


            {/* Main Content Section */}
            <Row className="m-lg-4 px-lg-5 text-primary">
                <Col lg={12}>
                    <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                        <CardBody className="p-2 p-sm-3 p-lg-4">

                            <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--brand)' }}>
                                Quick Summary
                            </h2>
                            <p className="mb-4" style={{ opacity: 0.9 }}>
                                This disclaimer outlines the limits of liability for content on quizblog.rw.
                            </p>


                            <p className="mb-4" style={{ opacity: 0.9 }}>
                                For more details or questions, contact us at{' '}
                                <a
                                    href="mailto:quizblog.rw@gmail.com"
                                    style={{ color: 'var(--brand)', fontWeight: 800, textDecoration: 'underline' }}
                                >
                                    quizblog.rw@gmail.com
                                </a>.
                            </p>

                            {isAdEnabled() && (
                                <Row className="mb-4">
                                    <Col xs={12}>
                                        <ResponsiveAd />
                                    </Col>
                                </Row>
                            )}

                            {/* Main disclaimer */}
                            <h2 className="h4 fw-bold mb-3">Disclaimers for quizblog.rw</h2>

                            <p>
                                All information on{' '}
                                <a href="https://www.quizblog.rw" className="text-primary text-break">
                                    https://www.quizblog.rw
                                </a>{' '}
                                is provided in good faith and for general information only. We do not guarantee
                                completeness, accuracy, or reliability. Any action you take is at your own risk.
                            </p>

                            <Alert
                                color="warning"
                                className="d-flex align-items-start gap-3 flex-column flex-md-row mb-4"
                            >
                                <i className="fas fa-exclamation-triangle h4 mb-2 mb-md-0"></i>
                                <div>
                                    We include links to external websites, but we cannot control or guarantee
                                    their content or nature.
                                </div>
                            </Alert>

                            <p>
                                External links do not imply our endorsement. Content on other sites may change
                                without notice.
                            </p>

                            <Alert
                                color="success"
                                className="d-flex align-items-start gap-3 flex-column flex-md-row mb-4"
                            >
                                <i className="fas fa-shield-alt h4 mb-2 mb-md-0"></i>
                                <div>
                                    When leaving quizblog.rw, other sites may have different privacy policies and
                                    terms. Review them before interacting or sharing information.
                                </div>
                            </Alert>

                            {/* Consent */}
                            <h2 className="h4 fw-bold mt-4 mb-3">Consent</h2>
                            <Alert
                                color="success"
                                className="d-flex align-items-start gap-3 flex-column flex-md-row mb-4"
                            >
                                <i className="fas fa-check-circle h4 mb-2 mb-md-0"></i>
                                <div>
                                    By using our website, you consent to and agree with this disclaimer.
                                </div>
                            </Alert>

                            {/* Update */}
                            <h2 className="h4 fw-bold mt-4 mb-3">Updates</h2>
                            <div className="d-flex align-items-start gap-3 flex-column flex-md-row">
                                <i className="fas fa-clock h4 mb-2 mb-md-0"></i>
                                <div>
                                    <p className="mb-2">Last updated: {lastUpdated}</p>
                                    <p className="mb-0">
                                        Any changes to this disclaimer will be posted here.
                                    </p>
                                </div>
                            </div>

                            {/* Bottom Ad */}
                            {isAdEnabled() && (
                                <div className="mt-4">
                                    <SquareAd />
                                </div>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Disclaimer;
