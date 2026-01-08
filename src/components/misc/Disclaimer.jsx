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

            {/* Jumbotron - matching FAQ style */}
            <div className="jbtron rounded px-3 px-sm-4 py-3 py-sm-5 p-2 py-lg-4 my-3 my-sm-4 text-center border border-info">
                <h1 className="display-5 fw-bolder text-white">Disclaimer</h1>

                <p className="lead mb-1 text-white">
                    Important information about our terms of use and liability limitations.
                </p>

                <p className="text-white">
                    This page explains what you can expect from Quiz-Blog and what we expect from users.
                </p>

                <small className="fw-bolder text-white">
                    Need clarification? Contact us at{' '}
                    <a
                        href="mailto:quizblog.rw@gmail.com"
                        style={{ color: 'var(--accent)' }}
                    >
                        <u>quizblog.rw@gmail.com</u>
                    </a>
                    .
                </small>

                <hr
                    className="my-2"
                    style={{
                        height: '2px',
                        borderWidth: 0,
                        backgroundColor: 'var(--brand)',
                    }}
                />
            </div>

            {/* Main Content Section */}
            <Row className="m-lg-4 px-lg-5 text-primary">
                <Col lg={12}>
                    <Card className="border rounded shadow-sm mb-4">
                        <CardBody className="p-4">

                            {/* Quick summary box styled like FAQ content blocks */}
                            <div className="bg-light p-4 rounded border mb-4 text-center">
                                <h2 className="h4 fw-bold mb-2">Quick Summary</h2>
                                <p className="mb-0">
                                    This disclaimer outlines the limits of liability for content on quizblog.rw.
                                </p>
                            </div>

                            {/* Contact info alert like FAQ */}
                            <Alert
                                color="info"
                                className="d-flex align-items-start gap-3 flex-column flex-md-row mb-4"
                            >
                                <i className="fas fa-info-circle h4 mb-2 mb-md-0"></i>
                                <div>
                                    For more details or questions, contact us at{' '}
                                    <a href="mailto:quizblog.rw@gmail.com" className="alert-link">
                                        quizblog.rw@gmail.com
                                    </a>.
                                </div>
                            </Alert>

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
