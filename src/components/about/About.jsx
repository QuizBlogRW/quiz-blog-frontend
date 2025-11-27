import { Row, Col } from 'reactstrap';
import SquareAd from '@/components/adsenses/SquareAd';
import ResponsiveAd from '@/components/adsenses/ResponsiveAd';
import isAdEnabled from '@/utils/isAdEnabled';
import Biographies from './Biographies';
import Intro from './Intro';
import './about.css';

const About = () => {
    return (
        <div className="about-section py-5">
            <Intro />
            {/* responsive ad (only in production) */}
            {isAdEnabled() && <Row className="justify-content-center my-4">
                <Col xs={12} md={10} className="text-center">
                    <ResponsiveAd />
                </Col>
            </Row>}

            <Biographies />

            {/* square ad footer */}
            {isAdEnabled() && <Row className="justify-content-center mt-4">
                <Col xs={12} md={6} className="text-center">
                    <SquareAd />
                </Col>
            </Row>}
        </div>
    );
};

export default About;