import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';
import SquareAd from '@/components/adsenses/SquareAd';
import {
    Row,
    Col,
    Card,
    CardBody
} from 'reactstrap';


import { formatDate } from '@/utils/dateFormat';

const Privacy = () => {

    const formattedDate = formatDate('2025-10-20');


    return (
        <div className="py-0 px-3 py-lg-5 w-100">

            <div className="mt-4 mb-3 text-center">
                <h1 className="fw-bolder" style={{ color: 'var(--brand)' }}>
                    Privacy Policy
                </h1>
                <p className="mb-2" style={{ color: '#1a1a1a', opacity: 0.85 }}>
                    Learn how Quiz-Blog collects, uses, and protects your data.
                </p>
                <small className="fw-bolder" style={{ color: 'var(--brand)' }}>
                    Have questions? Contact us at{' '}
                    <a href="mailto:quizblog.rw@gmail.com" style={{ color: 'var(--accent)' }}>
                        <u>quizblog.rw@gmail.com</u>
                    </a>
                    .
                </small>
                <hr className="my-3" style={{ height: '2px', borderWidth: 0, backgroundColor: 'var(--brand)' }} />
            </div>

            {/* Main Content Wrapper */}
            <Row className="m-lg-4 px-lg-5 text-primary">
                <Col lg={12}>
                    <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                        <CardBody className="p-2 p-sm-3 p-lg-4">

                            <h2 className="h4 fw-bold mb-2" style={{ color: 'var(--brand)' }}>
                                Privacy at a Glance
                            </h2>
                            <p className="mb-3" style={{ opacity: 0.9 }}>
                                We collect minimal data to operate, improve, and secure Quiz-Blog.
                            </p>

                            <p className="mb-4" style={{ fontWeight: 700, color: 'var(--brand-dark)' }}>
                                Last updated: <span style={{ color: 'var(--brand)' }}>{formattedDate}</span>
                            </p>

                            {/* Introduction */}
                            <p>
                                This Privacy Policy explains how Quiz-Blog collects, uses, and protects your
                                information. By using our Service, you agree to the practices described here.
                            </p>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>
                                Interpretation & Definitions
                            </h2>
                            <p className="mb-2" style={{ opacity: 0.9 }}>
                                Capitalized terms have the meanings defined below.
                            </p>

                            {isAdEnabled() && (
                                <Row className="my-4">
                                    <Col xs={12}>
                                        <ResponsiveAd />
                                    </Col>
                                </Row>
                            )}

                            <h3 className="fw-bold" style={{ color: 'var(--brand-dark)' }}>Key Definitions</h3>
                            <ul className="mb-4">
                                <li><strong>Account:</strong> A unique profile created to access our Service.</li>
                                <li><strong>Company:</strong> Refers to Quiz-Blog (“We”, “Us”).</li>
                                <li><strong>Cookies:</strong> Files stored on your device to enhance browsing.</li>
                                <li><strong>Device:</strong> Any device used to access the Service.</li>
                                <li><strong>Personal Data:</strong> Information that identifies an individual.</li>
                                <li><strong>Service:</strong> The Quiz-Blog website.</li>
                                <li><strong>Usage Data:</strong> Automatically collected usage information.</li>
                                <li><strong>You:</strong> The person using the Service.</li>
                            </ul>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>
                                Collecting & Using Your Data
                            </h2>
                            <p className="mb-2" style={{ opacity: 0.9 }}>
                                We collect the following categories of data:
                            </p>

                            <h3 className="fw-bold" style={{ color: 'var(--brand-dark)' }}>Personal Data</h3>
                            <ul className="mb-4">
                                <li>Email address</li>
                                <li>First and last name</li>
                                <li>Usage data</li>
                            </ul>

                            <h3 className="fw-bold" style={{ color: 'var(--brand-dark)' }}>Usage Data</h3>
                            <p className="mb-2" style={{ opacity: 0.9 }}>
                                Automatically collected information may include IP address, browser type, pages
                                visited, time spent on pages, and device identifiers.
                            </p>

                            <h3 className="fw-bold" style={{ color: 'var(--brand-dark)' }}>Cookies & Tracking Technologies</h3>
                            <p className="mb-2" style={{ opacity: 0.9 }}>
                                We use cookies and similar technologies to enhance your experience.
                            </p>
                            <ul className="mb-4">
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

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>How We Use Your Data</h2>
                            <ul className="mb-4">
                                <li>To provide and maintain our Service</li>
                                <li>To manage user accounts and registration</li>
                                <li>To send important updates or offers</li>
                                <li>To analyze usage trends and improve the Service</li>
                                <li>For legal compliance and business transfers</li>
                            </ul>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>Data Sharing</h2>
                            <p className="mb-2" style={{ opacity: 0.9 }}>We may share your data with:</p>
                            <ul className="mb-4">
                                <li>Analytics and support service providers</li>
                                <li>Business partners and affiliates</li>
                                <li>Other users in shared/public areas</li>
                                <li>Authorities, as required by law</li>
                            </ul>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>Retention & Security</h2>
                            <p className="mb-3" style={{ opacity: 0.9 }}>
                                We keep your data only as long as necessary and apply commercially reasonable
                                security measures. However, no online method is fully secure.
                            </p>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>Children&apos;s Privacy</h2>
                            <p className="mb-3" style={{ opacity: 0.9 }}>
                                Our Service is not intended for children under 13, and we do not knowingly collect
                                information from them.
                            </p>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>External Links</h2>
                            <p className="mb-3" style={{ opacity: 0.9 }}>
                                Quiz-Blog is not responsible for content on third-party websites. Always review their
                                privacy policies.
                            </p>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>Changes to This Policy</h2>
                            <p className="mb-3" style={{ opacity: 0.9 }}>
                                We may update this Privacy Policy. Changes will be posted here, and we may notify
                                you by email or on our website.
                            </p>

                            <h2 className="h4 fw-bold mt-4" style={{ color: 'var(--brand)' }}>Contact Us</h2>
                            <p className="mb-2" style={{ opacity: 0.9 }}>You can contact us via:</p>
                            <ul className="mb-4">
                                <li>
                                    Email:{' '}
                                    <a
                                        href="mailto:quizblog.rw@gmail.com"
                                        style={{ color: 'var(--brand)', fontWeight: 800, textDecoration: 'underline' }}
                                    >
                                        quizblog.rw@gmail.com
                                    </a>
                                </li>
                                <li>
                                    Website:{' '}
                                    <a
                                        href="https://www.quizblog.rw/contact"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: 'var(--brand)', fontWeight: 800, textDecoration: 'underline' }}
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
