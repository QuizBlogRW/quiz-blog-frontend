import { Row, Col } from "reactstrap"
import SquareAd from '@/components/adsenses/SquareAd'
import ResponsiveAd from '@/components/adsenses/ResponsiveAd'
import Biographies from './Biographies'
import Intro from './Intro'
import './about.css'

const About = () => {
    return (
        <section className="about-section px-0 mx-0">
            <div className="w-100">
                <Intro />
                {/* Google responsive 1 ad */}
                <Row className='w-100 px-lg-4'>
                    <Col sm="12">
                        <div className='w-100'>
                            {process.env.NODE_ENV !== 'development' ? <ResponsiveAd /> : null}
                        </div>
                    </Col>
                </Row>
                <Biographies />
                {/* Google square ad */}
                <Row className='w-100 px-lg-4'>
                    <Col sm="12">
                        <div className='w-100'>
                            {process.env.NODE_ENV !== 'development' ? <SquareAd /> : null}
                        </div>
                    </Col>
                </Row>
            </div>
        </section>)
}

export default About