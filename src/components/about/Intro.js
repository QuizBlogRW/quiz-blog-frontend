import React from 'react'
import { Row, Col, Jumbotron } from 'reactstrap'
import reading from '../../../src/images/reading.svg';

const Intro = () => {
    return (
        <div className='introduct pt-lg-5'>

            <h1 className="display-4 font-weight-bold text-center text-success py-4 my-lg-5">
                <span>Get To Know</span> Quiz-Blog
            </h1>

            <Row className='pt-lg-5 px-1 px-lg-5'>
                <Col sm='6' className='intro-img'>
                    <img src={reading} alt="" />
                </Col>

                <Col sm='6' className='intro-text d-flex flex-column align-self-center justify-items-center'>
                    <h1 className="font-weight-bold text-center text-success mb-5">
                        <u>Empowering learners</u>
                    </h1>

                    <p className="lead mb-4 pr-lg-5 font-weight-200">
                        Quiz-Blog was made to offer different types of quizzes and study materials that help students improve their thinking skills and get ready for exams. Our blog articles are about various subjects and help students understand their lessons better.
                        <hr />
                    </p>
                </Col>
            </Row>

            <Row className='px-3 px-lg-5'>
                <Jumbotron className="p-2 my-3 my-lg-5 how-started">

                    <h2 className="font-weight-bold text-center text-success my-4">
                        <b>How we started</b>
                    </h2>

                    <p>
                        Bruce, began his university studies in November 2019, which brought excitement but also presented challenges as learning was different from high school. Self-directed learning required more time, and students had to find relevant questions to revise what they learned in lectures. While he was adapting to this new approach, he faced difficulties.
                    </p>

                    <p>
                        On December 19, 2020, while studying, Bruce attempted tests and past papers (known as IBICUPURI). However, he encountered a problem – there were only a few tests, some without answers, making it hard to assess his learning progress. He wondered if other students faced the same issue and discovered that they did. This inspired him to create a website that would help him and his peers improve their learning. He shared his idea with his brother Parmenide, a software developer, who agreed to help create a website with Multiple Choice Questions (MCQs).
                    </p>

                    <p>
                        On February 2, 2021, Bruce created the first prototype, initially naming it Med-Blog, thinking it would publish medical blogs. However, he later realized that the true vision was to provide MCQs. Thus, he renamed it and began working on the website according to his original idea. In May, 2021, Quiz-Blog officially launched, and Bruce started sharing it with others, uploading various quizzes and refining the platform with the help of his team.
                    </p>

                    <p>
                        Initially focused on health sciences courses, Quiz-Blog expanded its team and now aims to assist both Rwandans and others in enhancing their minds and achieving better academic performance across various subjects and courses.
                    </p>

                    <hr className="my-2" style={{ height: "2px", borderWidth: 0, color: "#157A6E", backgroundColor: "#157A6E" }} />

                </Jumbotron>
            </Row>
        </div>
    )
}

export default Intro