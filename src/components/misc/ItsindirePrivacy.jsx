import { Card, CardBody, CardHeader } from 'reactstrap';

const ItsindirePrivacy = () => {
    return (
        <div className="my-5">
            <h1 className="mb-4 text-center">Itsindire RW Privacy Policy</h1>

            {/* Introduction */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">Introduction</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        Welcome to Itsindire RW app. We are committed to protecting your personal information and your right to privacy.
                        If you have any questions about our policy or practices regarding your personal information, please contact us at{' '}
                        <a href="mailto:itsindire.rw@gmail.com">itsindire.rw@gmail.com</a>.
                    </p>
                </CardBody>
            </Card>

            {/* Information We Collect */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">Information We Collect</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        We collect personal information you voluntarily provide when registering, expressing interest in our products or services, participating in app activities, or contacting us.
                    </p>
                    <p>The personal information collected depends on your interactions and choices, including:</p>
                    <ul>
                        <li><strong>Name and Contact Data:</strong> First/last name, email, phone number, and similar contact info.</li>
                        <li><strong>Credentials:</strong> Passwords, hints, and authentication info.</li>
                        <li><strong>Payment Data:</strong> Payment instrument info, such as Momo number and security codes, for processing purchases.</li>
                    </ul>
                </CardBody>
            </Card>

            {/* How We Use Your Information */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">How We Use Your Information</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        We process personal information to operate and improve our app, based on legitimate business interests, contractual obligations, consent, and legal requirements:
                    </p>
                    <ul>
                        <li>Facilitate account creation and logon process.</li>
                        <li>Send administrative information.</li>
                        <li>Fulfill and manage orders.</li>
                        <li>Post testimonials.</li>
                        <li>Request feedback.</li>
                        <li>Protect our services.</li>
                        <li>Enforce terms, conditions, and policies.</li>
                        <li>Respond to legal requests and prevent harm.</li>
                        <li>Manage user accounts.</li>
                        <li>Deliver services to users.</li>
                        <li>Provide user support.</li>
                    </ul>
                </CardBody>
            </Card>

            {/* Sharing Your Information */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">Sharing Your Information</h2>
                </CardHeader>
                <CardBody>
                    <p>We only share your information in specific situations:</p>
                    <ul>
                        <li><strong>Compliance with Laws:</strong> Disclose data to meet legal obligations or governmental requests.</li>
                        <li><strong>Vital Interests & Legal Rights:</strong> Prevent harm, investigate policy violations, fraud, or threats.</li>
                        <li><strong>Vendors & Service Providers:</strong> Third-party partners for payment, hosting, support, marketing, or analytics.</li>
                    </ul>
                </CardBody>
            </Card>

            {/* Security of Your Information */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">Security of Your Information</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        We implement administrative, technical, and physical measures to protect your data. However, no method of storage or transmission is 100% secure.
                    </p>
                </CardBody>
            </Card>

            {/* Your Privacy Rights */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">Your Privacy Rights</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        You may have rights under applicable data protection laws, including access, correction, erasure, restriction of processing, data portability, or objection. To exercise these rights, contact us via the details below.
                    </p>
                </CardBody>
            </Card>

            {/* Contact Us */}
            <Card className="mb-4 shadow-sm">
                <CardHeader className="bg-light">
                    <h2 className="h5 mb-0">Contact Us</h2>
                </CardHeader>
                <CardBody>
                    <p>
                        For questions or comments about this policy, contact: Itsindire RW at{' '}
                        <a href="mailto:itsindire.rw@gmail.com">itsindire.rw@gmail.com</a>.
                    </p>
                </CardBody>
            </Card>
        </div>
    );
};

export default ItsindirePrivacy;
