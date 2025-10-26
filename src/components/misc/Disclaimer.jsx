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
} from "reactstrap";
import moment from 'moment';

const Disclaimer = () => {
    const lastUpdated = moment().format('MMMM D, YYYY');

    return (
        <Container className="my-3 my-md-5">
            <Card className="border-0 shadow-sm">
                <CardHeader className="bg-light border-bottom">
                    <h1 className="h2 h1-md mb-0 text-center text-md-start">
                        Disclaimer for Quiz-Blog
                    </h1>
                </CardHeader>

                {/* Centered hero block using Bootstrap grid (constrained width) */}
                <Row className="justify-content-center">
                    <Col md={6} className="mx-auto">
                        <div className="text-center bg-light rounded p-3 my-3 shadow-sm">
                            <h2 className="h5 mb-1">Quick summary</h2>
                            <p className="mb-0 small">This page explains limits of liability and usage terms for content on quizblog.rw.</p>
                        </div>
                    </Col>
                </Row>

                <CardBody className="p-3 p-md-4">
                    <Alert color="success" className="d-flex align-items-center gap-3 mb-4">
                        <i className="fas fa-info-circle h4 mb-0"></i>
                        <div>
                            If you require any more information or have any questions about our site's disclaimer,
                            please feel free to contact us by email at{' '}
                            <a href="mailto:quizblog.rw@gmail.com" className="alert-link">
                                quizblog.rw@gmail.com
                            </a>
                        </div>
                    </Alert>

                    <div className="mb-4">
                        <Card className="border">
                            <CardHeader>
                                <h2 className="h4 mb-0">Disclaimers for quizblog.rw</h2>
                            </CardHeader>
                            <CardBody>
                                <Row className="mb-3">
                                    <Col xs={12}>
                                        {process.env.NODE_ENV !== 'development' && <ResponsiveAd />}
                                    </Col>
                                </Row>

                                <div>
                                    <p className="mb-3">
                                        All the information on this website - {' '}
                                        <a href="https://www.quizblog.rw"
                                            className="text-primary text-break">
                                            https://www.quizblog.rw
                                        </a> -
                                        is published in good faith and for general information purpose only. quizblog.rw does not make any warranties
                                        about the completeness, reliability and accuracy of this information. Any action you take upon the information
                                        you find on this website (quizblog.rw), is strictly at your own risk. quizblog.rw will not be liable for any
                                        losses and/or damages in connection with the use of our website.
                                    </p>

                                    <Alert color="warning" className="d-flex align-items-center gap-3 mb-3">
                                        <i className="fas fa-exclamation-triangle h4 mb-0"></i>
                                        <div>
                                            From our website, you can visit other websites by following hyperlinks to such external sites.
                                            While we strive to provide only quality links to useful and ethical websites, we have no control
                                            over the content and nature of these sites.
                                        </div>
                                    </Alert>

                                    <p className="mb-3">
                                        These links to other websites do not imply a recommendation
                                        for all the content found on these sites. Site owners and content may change without notice and may
                                        occur before we have the opportunity to remove a link which may have gone 'bad'.
                                    </p>

                                    <Alert color="secondary" className="d-flex align-items-center gap-3 mb-0">
                                        <i className="fas fa-shield-alt h4 mb-0"></i>
                                        <div>
                                            Please be aware that when you leave our website, other sites may have different privacy policies
                                            and terms which are beyond our control. Please be sure to check the Privacy Policies of these sites
                                            as well as their "Terms of Service" before engaging in any business or uploading any information.
                                        </div>
                                    </Alert>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="mb-4">
                        <Card className="border-success">
                            <CardHeader className="bg-success bg-opacity-10">
                                <h2 className="h4 mb-0">Consent</h2>
                            </CardHeader>
                            <CardBody>
                                <Alert color="success" className="d-flex align-items-center gap-3 mb-0">
                                    <i className="fas fa-check-circle h4 mb-0"></i>
                                    <div>
                                        By using our website, you hereby consent to our disclaimer and agree to its terms.
                                    </div>
                                </Alert>
                            </CardBody>
                        </Card>
                    </div>

                    <div className="mb-4">
                        <Card>
                            <CardHeader>
                                <h2 className="h4 mb-0">Update</h2>
                            </CardHeader>
                            <CardBody>
                                <div className="d-flex align-items-center gap-3">
                                    <i className="fas fa-clock h4 mb-0"></i>
                                    <div>
                                        <p className="mb-2">Last updated: {lastUpdated}</p>
                                        <p className="mb-0">Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    <Row>
                        <Col xs={12}>
                            {process.env.NODE_ENV !== 'development' && <SquareAd />}
                        </Col>
                    </Row>
                </CardBody>
            </Card>
        </Container>
    );
};

export default Disclaimer;
