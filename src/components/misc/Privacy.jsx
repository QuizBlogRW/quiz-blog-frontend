import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';
import SquareAd from '@/components/adsenses/SquareAd';

import {
    Row,
    Col,
    Card,
    CardBody,
    Alert
} from 'reactstrap';

import moment from 'moment';

const Privacy = () => {
    const formattedDate = moment('2025-10-20').format('MMMM D, YYYY');

    return (
        <div className="py-0 px-3 py-lg-5 w-100">

            {/* Jumbotron styled like FAQs */}
            <div className="jbtron rounded px-3 px-sm-4 py-3 py-sm-5 p-2 py-lg-4 my-3 my-sm-4 text-center border border-info">
                <h1 className="display-5 fw-bolder text-white">Privacy Policy</h1>

                <p className="lead mb-1 text-white">
                    Learn how Quiz-Blog collects, uses, and protects your data.
                </p>

                <p className="text-white">
                    We prioritize transparency so you understand exactly what happens with your information.
                </p>

                <small className="fw-bolder text-white">
                    Have questions? Contact us at{' '}
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

            {/* Main Content Wrapper */}
            <Row className="m-lg-4 px-lg-5 text-primary">
                <Col lg={12}>
                    <Card className="border rounded shadow-sm mb-4">
                        <CardBody className="p-4">

                            {/* Summary Box */}
                            <div className="bg-light p-4 rounded border mb-4 text-center">
                                <h2 className="h4 fw-bold mb-2">Privacy at a Glance</h2>
                                <p className="mb-0">
                                    We collect minimal data to operate, improve, and secure Quiz-Blog.
                                </p>
                            </div>

                            {/* Last updated */}
                            <Alert
                                color="warning"
                                className="d-flex align-items-start gap-3 flex-column flex-md-row mb-4"
                            >
                                <i className="fas fa-calendar h4 mb-2 mb-md-0"></i>
                                <div>
                                    Last updated: <strong>{formattedDate}</strong>
                                </div>
                            </Alert>

                            {/* Introduction */}
                            <p>
                                This Privacy Policy explains how Quiz-Blog collects, uses, and protects your
                                information. By using our Service, you agree to the practices described here.
                            </p>

                            {/* Section: Definitions */}
                            <h2 className="h4 fw-bold mt-4">Interpretation & Definitions</h2>
                            <p>Capitalized terms have the meanings defined below.</p>

                            {isAdEnabled() && (
                                <Row className="my-4">
                                    <Col xs={12}>
                                        <ResponsiveAd />
                                    </Col>
                                </Row>
                            )}

                            <h3 className="fw-bold">Key Definitions</h3>
                            <ul>
                                <li><strong>Account:</strong> A unique profile created to access our Service.</li>
                                <li><strong>Company:</strong> Refers to Quiz-Blog (“We”, “Us”).</li>
                                <li><strong>Cookies:</strong> Files stored on your device to enhance browsing.</li>
                                <li><strong>Device:</strong> Any device used to access the Service.</li>
                                <li><strong>Personal Data:</strong> Information that identifies an individual.</li>
                                <li><strong>Service:</strong> The Quiz-Blog website.</li>
                                <li><strong>Usage Data:</strong> Automatically collected usage information.</li>
                                <li><strong>You:</strong> The person using the Service.</li>
                            </ul>

                            {/* Section: Collected Data */}
                            <h2 className="h4 fw-bold mt-4">Collecting & Using Your Data</h2>
                            <p>We collect the following categories of data:</p>

                            <h3 className="fw-bold">Personal Data</h3>
                            <ul>
                                <li>Email address</li>
                                <li>First and last name</li>
                                <li>Usage data</li>
                            </ul>

                            <h3 className="fw-bold">Usage Data</h3>
                            <p>
                                Automatically collected information may include IP address, browser type, pages
                                visited, time spent on pages, and device identifiers.
                            </p>

                            <h3 className="fw-bold">Cookies & Tracking Technologies</h3>
                            <p>We use cookies and similar technologies to enhance your experience.</p>
                            <ul>
                                <li><strong>Session Cookies:</strong> Required for authentication and functionality.</li>
                                <li><strong>Persistent Cookies:</strong> Store preferences and track cookie consent.</li>
                            </ul>

                            {isAdEnabled() && (
                                <Row className="my-4">
                                    <Col xs={12}>
                                        <SquareAd />
                                    </Col>
                                </Row>
                            )}

                            {/* Section: How We Use Data */}
                            <h2 className="h4 fw-bold mt-4">How We Use Your Data</h2>
                            <ul>
                                <li>To provide and maintain our Service</li>
                                <li>To manage user accounts and registration</li>
                                <li>To send important updates or offers</li>
                                <li>To analyze usage trends and improve the Service</li>
                                <li>For legal compliance and business transfers</li>
                            </ul>

                            {/* Section: Data Sharing */}
                            <h2 className="h4 fw-bold mt-4">Data Sharing</h2>
                            <p>We may share your data with:</p>
                            <ul>
                                <li>Analytics and support service providers</li>
                                <li>Business partners and affiliates</li>
                                <li>Other users in shared/public areas</li>
                                <li>Authorities, as required by law</li>
                            </ul>

                            {/* Section: Retention & Security */}
                            <h2 className="h4 fw-bold mt-4">Retention & Security</h2>
                            <p>
                                We keep your data only as long as necessary and apply commercially reasonable
                                security measures. However, no online method is fully secure.
                            </p>

                            {/* Section: Children's Privacy */}
                            <h2 className="h4 fw-bold mt-4">Children&apos;s Privacy</h2>
                            <p>
                                Our Service is not intended for children under 13, and we do not knowingly collect
                                information from them.
                            </p>

                            {/* Section: External Links */}
                            <h2 className="h4 fw-bold mt-4">External Links</h2>
                            <p>
                                Quiz-Blog is not responsible for content on third-party websites. Always review their
                                privacy policies.
                            </p>

                            {/* Section: Changes */}
                            <h2 className="h4 fw-bold mt-4">Changes to This Policy</h2>
                            <p>
                                We may update this Privacy Policy. Changes will be posted here, and we may notify
                                you by email or on our website.
                            </p>

                            {/* Contact Section */}
                            <h2 className="h4 fw-bold mt-4">Contact Us</h2>
                            <p>You can contact us via:</p>
                            <ul>
                                <li>Email: <a href="mailto:quizblog.rw@gmail.com">quizblog.rw@gmail.com</a></li>
                                <li>
                                    Website:{' '}
                                    <a
                                        href="https://www.quizblog.rw/contact"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Contact Page
                                    </a>
                                </li>
                            </ul>

                            {/* Bottom Ad */}
                            {isAdEnabled() && (
                                <Row className="my-4">
                                    <Col xs={12}>
                                        <SquareAd />
                                    </Col>
                                </Row>
                            )}

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Privacy;
