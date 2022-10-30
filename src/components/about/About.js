import React from 'react'
import ResponsiveAd from '../adsenses/ResponsiveAd'
import SquareAd from '../adsenses/SquareAd'
import Biographies from './Biographies'
import Intro from './Intro'
import './about.css'

const About = () => {
    return (
        <section className="about-section py-1 py-lg-4">

            <div className="container-flex px-1 px-lg-5">
                <Intro />
                {/* Google responsive 1 ad */}
                <ResponsiveAd />
                <Biographies />
                {/* Google square ad */}
                <SquareAd />
            </div>
        </section>)
}

export default About