import React from 'react'
import ResponsiveAd from '../adsenses/ResponsiveAd'
import { Row, Col } from "reactstrap"
import SquareAd from '../adsenses/SquareAd'
import Biographies from './Biographies'
import Intro from './Intro'
import './about.css'

const About = () => {
    return (
        <section className="about-section py-1 py-lg-4">

            <div className="container-flex px-1 px-lg-5 w-100">
                <Intro />
                {/* Google responsive 1 ad */}
                <Row className='w-100'>
                    <Col sm="12" className='w-100'>
                        <div className='w-100'>
                            <ResponsiveAd />
                        </div>
                    </Col>
                </Row>
                <Biographies />
                {/* Google square ad */}
                <Row className='w-100'>
                    <Col sm="12" className='w-100'>
                        <div className='w-100'>
                            <SquareAd />
                        </div>
                    </Col>
                </Row>
            </div>
        </section>)
}

export default About