import { Card, CardBody, CardHeader } from 'reactstrap';

const ItsindirePrivacy = () => {
    return (
        <div className="py-0 px-3 py-lg-5 w-100">

            {/* FAQ-style jumbotron */}
            <div className="jbtron rounded px-3 px-sm-4 py-3 py-sm-5 p-2 py-lg-4 my-3 my-sm-4 text-center border border-info">
                <h1 className="display-5 fw-bolder text-white">Itsindire RW Privacy Policy</h1>

                <p className="lead mb-1 text-white">
                    Learn how Itsindire RW collects, uses, and protects your personal information.
                </p>

                <p className="text-white">
                    We value transparency and are committed to keeping your data safe.
                </p>

                <small className="fw-bolder text-white">
                    Have questions? Contact us at{' '}
                    <a
                        href="mailto:itsindire.rw@gmail.com"
                        style={{ color: 'var(--accent)' }}
                    >
                        <u>itsindire.rw@gmail.com</u>
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

            {/* Main content */}
            <div className="m-lg-4 px-lg-5 text-primary">

                {/* Introduction */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">Introduction</h2>
                    </CardHeader>
                    <CardBody>
                        <p>
                            Welcome to the Itsindire RW App. We are committed to protecting your personal information and your right to privacy.
                            If you have any questions about our policy or practices, please contact us at{' '}
                            <a href="mailto:itsindire.rw@gmail.com" className="text-primary">
                                <u>itsindire.rw@gmail.com</u>
                            </a>.
                        </p>
                    </CardBody>
                </Card>

                {/* Information We Collect */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">Information We Collect</h2>
                    </CardHeader>
                    <CardBody>
                        <p>
                            We collect personal information that you voluntarily provide when registering an account, showing interest in our services,
                            participating in app activities, or contacting us.
                        </p>

                        <p>The information collected may include:</p>

                        <ul>
                            <li>
                                <strong>Name & Contact Data:</strong> First/last name, phone number, email address, and other contact information.
                            </li>
                            <li>
                                <strong>Credentials:</strong> Passwords, hints, and security authentication information.
                            </li>
                            <li>
                                <strong>Payment Data:</strong> Mobile money details (e.g., MoMo number) or other payment information used for purchases.
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* How We Use Your Information */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">How We Use Your Information</h2>
                    </CardHeader>
                    <CardBody>
                        <p>
                            We process your information to operate, improve, and protect the Itsindire RW App. This includes:
                        </p>

                        <ul>
                            <li>Facilitating account creation and login.</li>
                            <li>Sending important administrative updates.</li>
                            <li>Managing and fulfilling orders.</li>
                            <li>Posting user testimonials.</li>
                            <li>Requesting user feedback.</li>
                            <li>Protecting the app and preventing fraud.</li>
                            <li>Enforcing terms and policies.</li>
                            <li>Responding to legal requests.</li>
                            <li>Managing user accounts.</li>
                            <li>Providing and improving the service.</li>
                            <li>Offering customer support.</li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Sharing Your Information */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">Sharing Your Information</h2>
                    </CardHeader>
                    <CardBody>
                        <p>We only share your information under specific circumstances, such as:</p>

                        <ul>
                            <li>
                                <strong>Compliance with Laws:</strong> Meeting legal obligations or responding to government requests.
                            </li>
                            <li>
                                <strong>Vital Interests & Legal Rights:</strong> Preventing harm, investigating fraud, or enforcing policies.
                            </li>
                            <li>
                                <strong>Service Providers:</strong> Trusted third parties for hosting, payments, analytics, or app support.
                            </li>
                        </ul>
                    </CardBody>
                </Card>

                {/* Security */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">Security of Your Information</h2>
                    </CardHeader>
                    <CardBody>
                        <p>
                            We apply administrative, technical, and physical safeguards to protect your information.
                            However, no method of online transmission or storage is completely secure.
                        </p>
                    </CardBody>
                </Card>

                {/* Privacy Rights */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">Your Privacy Rights</h2>
                    </CardHeader>
                    <CardBody>
                        <p>
                            Depending on your region, you may have rights such as access, correction, deletion, restriction,
                            data portability, or objection to processing. Contact us to exercise these rights.
                        </p>
                    </CardBody>
                </Card>

                {/* Contact Us */}
                <Card className="border rounded shadow-sm mb-4">
                    <CardHeader className="bg-light">
                        <h2 className="h4 fw-bold mb-0">Contact Us</h2>
                    </CardHeader>
                    <CardBody>
                        <p>
                            If you have questions or comments about this policy, reach out at:{' '}
                            <a href="mailto:itsindire.rw@gmail.com" className="text-primary">
                                <u>itsindire.rw@gmail.com</u>
                            </a>.
                        </p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default ItsindirePrivacy;
