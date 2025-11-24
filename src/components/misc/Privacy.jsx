import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import SquareAd from '@/components/adsenses/SquareAd';
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Alert
} from 'reactstrap';
import moment from 'moment';

const Privacy = () => {
    const formattedDate = moment('2025-10-20').format('MMMM D, YYYY');

    return (
        <Container className="my-4 my-md-5 privacy-page">
            <Card className="border-0 shadow-sm">
                <CardHeader className="bg-light border-bottom text-center text-md-start">
                    <h1 className="h2 mb-0">Privacy Policy</h1>
                </CardHeader>

                {/* Hero summary */}
                <Row className="justify-content-center my-4">
                    <Col md={6}>
                        <div className="text-center bg-light rounded p-4 shadow-sm">
                            <h2 className="h5 mb-2">Privacy at a Glance</h2>
                            <p className="small mb-0">
                                We collect minimal data to operate and improve our service. This page explains what we collect and why.
                            </p>
                        </div>
                    </Col>
                </Row>

                <CardBody className="p-3 p-md-4">

                    {/* Last updated */}
                    <Alert color="warning" className="d-flex align-items-center gap-3 mb-4">
                        <i className="fas fa-calendar h4 mb-0"></i>
                        <div>Last updated: {formattedDate}</div>
                    </Alert>

                    {/* Introduction */}
                    <p>
                        This Privacy Policy explains how Quiz-Blog collects, uses, and protects your information when you use our Service.
                        By using our Service, you agree to the practices described here.
                    </p>

                    <h2>Interpretation & Definitions</h2>
                    <p>Capitalized terms have the meanings defined here, whether singular or plural.</p>

                    {/* Ad */}
                    <Row className="my-4">
                        <Col xs={12}>
                            <ResponsiveAd />
                        </Col>
                    </Row>

                    <h3>Key Definitions</h3>
                    <ul>
                        <li><strong>Account:</strong> A unique account created to access our Service.</li>
                        <li><strong>Company:</strong> Refers to Quiz-Blog, “We” or “Us”.</li>
                        <li><strong>Cookies:</strong> Small files stored on your device to enhance your browsing experience.</li>
                        <li><strong>Device:</strong> Any device used to access the Service, e.g., computer, phone, tablet.</li>
                        <li><strong>Personal Data:</strong> Any information that identifies or can identify an individual.</li>
                        <li><strong>Service:</strong> Refers to the Quiz-Blog website.</li>
                        <li><strong>Usage Data:</strong> Data collected automatically during use of the Service.</li>
                        <li><strong>You:</strong> The person accessing or using the Service.</li>
                    </ul>

                    <h2>Collecting & Using Your Data</h2>
                    <p>We collect the following types of data:</p>
                    <h3>Personal Data</h3>
                    <ul>
                        <li>Email address</li>
                        <li>First and last name</li>
                        <li>Usage data</li>
                    </ul>

                    <h3>Usage Data</h3>
                    <p>Automatically collected data may include IP address, browser type, pages visited, time spent, and device identifiers.</p>

                    <h3>Cookies & Tracking</h3>
                    <p>We use cookies and similar technologies to improve our Service and track usage.</p>
                    <ul>
                        <li><strong>Session Cookies:</strong> Temporary cookies for user authentication and site functionality.</li>
                        <li><strong>Persistent Cookies:</strong> Save preferences and track acceptance of cookies.</li>
                    </ul>

                    {/* Ad */}
                    <Row className="my-4">
                        <Col xs={12}>
                            <SquareAd />
                        </Col>
                    </Row>

                    <h2>How We Use Your Data</h2>
                    <ul>
                        <li>Provide and maintain our Service</li>
                        <li>Manage your account and registration</li>
                        <li>Communicate important updates and offers</li>
                        <li>Analyze usage trends and improve the Service</li>
                        <li>Legal and business purposes, including mergers or transfers</li>
                    </ul>

                    <h2>Data Sharing</h2>
                    <p>We may share your data with:</p>
                    <ul>
                        <li>Service providers for analytics or support</li>
                        <li>Business partners and affiliates</li>
                        <li>Other users in public areas</li>
                        <li>As required by law or with consent</li>
                    </ul>

                    <h2>Retention & Security</h2>
                    <p>We retain data only as long as necessary and implement commercially reasonable security measures. However, no online method is 100% secure.</p>

                    <h2>Children's Privacy</h2>
                    <p>Our Service is not intended for children under 13. We do not knowingly collect data from children under 13.</p>

                    <h2>External Links</h2>
                    <p>We are not responsible for third-party websites. Review their privacy policies when visiting their sites.</p>

                    <h2>Changes to This Policy</h2>
                    <p>We may update this Policy. Updates will be posted on this page, and we may notify you via email or on our website.</p>

                    <h2>Contact Us</h2>
                    <p>You can contact us via:</p>
                    <ul>
                        <li>Email: quizblog.rw@gmail.com</li>
                        <li>Website: <a href="https://www.quizblog.rw/contact" target="_blank" rel="noopener noreferrer">Contact Page</a></li>
                    </ul>

                    <Row className="my-4">
                        <Col xs={12}>
                            <SquareAd />
                        </Col>
                    </Row>

                </CardBody>
            </Card>
        </Container>
    );
};

export default Privacy;
