import SquareAd from '@/components/adsenses/SquareAd';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
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

const Disclaimer = () => {
    const lastUpdated = moment().format('MMMM D, YYYY');

    return (
        <Container className="my-4 my-md-5">
            <Card className="border-0 shadow-sm">
                <CardHeader className="bg-light border-bottom text-center text-md-start">
                    <h1 className="h2 mb-0">Disclaimer for Quiz-Blog</h1>
                </CardHeader>

                {/* Hero summary */}
                <Row className="justify-content-center my-4">
                    <Col md={6}>
                        <div className="text-center bg-light rounded p-4 shadow-sm">
                            <h2 className="h5 mb-2">Quick Summary</h2>
                            <p className="small mb-0">
                                This page explains limits of liability and terms of use for content on quizblog.rw.
                            </p>
                        </div>
                    </Col>
                </Row>

                <CardBody className="p-3 p-md-4">
                    {/* Contact info */}
                    <Alert color="info" className="d-flex align-items-start gap-3 mb-4 flex-column flex-md-row">
                        <i className="fas fa-info-circle h4 mb-2 mb-md-0"></i>
                        <div>
                            For more information or questions about this disclaimer, contact us at{' '}
                            <a href="mailto:quizblog.rw@gmail.com" className="alert-link">
                                quizblog.rw@gmail.com
                            </a>
                            .
                        </div>
                    </Alert>

                    {/* Main Disclaimer Section */}
                    <Card className="border mb-4">
                        <CardHeader>
                            <h2 className="h4 mb-0">Disclaimers for quizblog.rw</h2>
                        </CardHeader>
                        <CardBody>
                            <Row className="mb-4">
                                <Col xs={12}>
                                    <ResponsiveAd />
                                </Col>
                            </Row>

                            <p>
                                All information on this website {' '}
                                <a href="https://www.quizblog.rw" className="text-primary text-break">
                                    https://www.quizblog.rw
                                </a>
                                {' '}is published in good faith and for general information only. Quiz-Blog does not guarantee the completeness, reliability, or accuracy of this information. Any action you take based on this content is at your own risk.
                            </p>

                            <Alert color="warning" className="d-flex align-items-start gap-3 mb-3 flex-column flex-md-row">
                                <i className="fas fa-exclamation-triangle h4 mb-2 mb-md-0"></i>
                                <div>
                                    We may include links to other websites. While we strive to link only to quality and ethical sites, we cannot control their content.
                                </div>
                            </Alert>

                            <p>
                                Links to external websites do not imply endorsement. Site content may change without notice.
                            </p>

                            <Alert color="success" className="d-flex align-items-start gap-3 mb-0 flex-column flex-md-row">
                                <i className="fas fa-shield-alt h4 mb-2 mb-md-0"></i>
                                <div>
                                    When leaving our website, other sites may have different privacy policies and terms. Review them before engaging or submitting personal information.
                                </div>
                            </Alert>
                        </CardBody>
                    </Card>

                    {/* Consent Section */}
                    <Card className="border-success mb-4">
                        <CardHeader className="bg-success bg-opacity-10">
                            <h2 className="h4 mb-0">Consent</h2>
                        </CardHeader>
                        <CardBody>
                            <Alert color="success" className="d-flex align-items-start gap-3 flex-column flex-md-row mb-0">
                                <i className="fas fa-check-circle h4 mb-2 mb-md-0"></i>
                                <div>
                                    By using our website, you consent to this disclaimer and agree to its terms.
                                </div>
                            </Alert>
                        </CardBody>
                    </Card>

                    {/* Update Section */}
                    <Card className="mb-4">
                        <CardHeader>
                            <h2 className="h4 mb-0">Update</h2>
                        </CardHeader>
                        <CardBody className="d-flex align-items-start gap-3 flex-column flex-md-row">
                            <i className="fas fa-clock h4 mb-2 mb-md-0"></i>
                            <div>
                                <p className="mb-2">Last updated: {lastUpdated}</p>
                                <p className="mb-0">Any updates or changes to this disclaimer will be prominently posted here.</p>
                            </div>
                        </CardBody>
                    </Card>

                    {/* Bottom Ad */}
                    <Row>
                        <Col xs={12}>
                            <SquareAd />
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    );
};

export default Disclaimer;
