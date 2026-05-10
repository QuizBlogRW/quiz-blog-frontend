import { Card, CardBody } from 'reactstrap';


const ItsindirePrivacy = () => {
    return (
        <div className="py-0 px-3 py-lg-5 w-100">

            <div className="mt-4 mb-3 text-center">
                <h1 className="fw-bolder" style={{ color: 'var(--brand)' }}>
                    Itsindire RW Privacy Policy
                </h1>
                <p className="mb-2" style={{ opacity: 0.85 }}>
                    Learn how Itsindire RW collects, uses, and protects your personal information.
                </p>
                <small className="fw-bolder" style={{ color: 'var(--brand)' }}>
                    Have questions? Contact us at{' '}
                    <a href="mailto:itsindire.rw@gmail.com" style={{ color: 'var(--accent)' }}>
                        <u>itsindire.rw@gmail.com</u>
                    </a>
                    .
                </small>
                <hr className="my-3" style={{ height: '2px', borderWidth: 0, backgroundColor: 'var(--brand)' }} />
            </div>

            {/* Main content */}
            <div className="m-lg-4 px-lg-5 text-primary">

                {/* Introduction */}
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>Introduction</h2>
                        <p className="mb-3" style={{ opacity: 0.9 }}>
                            Welcome to the Itsindire RW App. We are committed to protecting your personal information and your right to privacy.
                            If you have any questions about our policy or practices, please contact us at{' '}
                            <a href="mailto:itsindire.rw@gmail.com" className="text-primary">
                                <u>itsindire.rw@gmail.com</u>
                            </a>.
                        </p>
                    </CardBody>
                </Card>

                {/* Information We Collect */}
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>Information We Collect</h2>
                        <p className="mb-2" style={{ opacity: 0.9 }}>
                            We collect personal information that you voluntarily provide when registering an account, showing interest in our services,
                            participating in app activities, or contacting us.
                        </p>

                        <p className="mb-2">The information collected may include:</p>

                        <ul className="mb-4">
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
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>How We Use Your Information</h2>
                        <p className="mb-2" style={{ opacity: 0.9 }}>
                            We process your information to operate, improve, and protect the Itsindire RW App. This includes:
                        </p>

                        <ul className="mb-4">
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
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>Sharing Your Information</h2>
                        <p className="mb-2" style={{ opacity: 0.9 }}>We only share your information under specific circumstances, such as:</p>

                        <ul className="mb-4">
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
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>Security of Your Information</h2>
                        <p className="mb-3" style={{ opacity: 0.9 }}>
                            We apply administrative, technical, and physical safeguards to protect your information.
                            However, no method of online transmission or storage is completely secure.
                        </p>
                    </CardBody>
                </Card>

                {/* Privacy Rights */}
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>Your Privacy Rights</h2>
                        <p className="mb-3" style={{ opacity: 0.9 }}>
                            Depending on your region, you may have rights such as access, correction, deletion, restriction,
                            data portability, or objection to processing. Contact us to exercise these rights.
                        </p>
                    </CardBody>
                </Card>

                {/* Contact Us */}
                <Card className="border-0 mb-4" style={{ background: 'transparent' }}>
                    <CardBody className="p-0">
                        <h2 className="h4 fw-bold" style={{ color: 'var(--brand)' }}>Contact Us</h2>
                        <p className="mb-3" style={{ opacity: 0.9 }}>
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
