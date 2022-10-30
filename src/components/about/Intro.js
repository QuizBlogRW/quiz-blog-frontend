import React from 'react'
import { Row, Col, Jumbotron } from 'reactstrap'
import reading from '../../../src/images/reading.svg';

const Intro = () => {
    return (
        <div className='introduct pt-lg-5'>

            <h1 className="display-4 font-weight-bold text-center text-success my-4 mb-lg-5">
                About Quiz Blog
            </h1>

            <Row className='pt-lg-5'>
                <Col sm='6' className='intro-img'>
                    <img src={reading} alt="" />
                </Col>

                <Col sm='6' className='intro-text d-flex flex-column align-self-center justify-items-center'>
                    <h2 className="font-weight-bold text-center text-success mb-4">
                        <u>Empowering learners</u>
                    </h2>

                    <p className="lead mb-4">
                        Quiz-Blog was developed to provide multi-category quizzes and learning materials helping students to sharpen their minds and prepare for their exams. Its blog articles are related to studies and helps students to understand more from what they learn.
                    </p>
                </Col>
            </Row>

            <Row>
                <Jumbotron className="p-2 my-3 my-lg-5">

                    <h2 className="font-weight-bold text-center text-success my-4">
                        <u>How we started</u>
                    </h2>

                    <p>
                        The innovator, BRUCE started university studies in November 2019. That was exciting to him but again tough because learning was different from high school. Because, self-directed learning takes much time than in high school and students have to find questions that will help them revise what lecturers have provided during classes, He started getting used to this but it was bringing some troubles.
                    </p>

                    <p>
                        He remembers on December 19, 2020 while he was learning, he tried to do some tests and correct some past papers (known as IBICUPURI). Unfortunately, tests were few, others were without answers and this brought struggle to his studies as it was hard to determine his learning efficiency. He asked himself whether this happens to his fellow students and he came to find out it was the same. This prompted him an idea of creating a website that can help him and his fellows to improve their learning. He talked to his brother PARMENIDE who develops web apps and told him about the idea and asked if he can create a website which will provide Multiple Choice Questions.
                    </p>

                    <p>
                        On February 2, 2021, he created the first prototype and called it Med-Blog. He thought that He wanted a web to publish medical related blogs but this wasn’t his idea. He wanted a website which will provide MCQs. So, he changed it and started to work on the website which he had in his idea. May 17, 2021 is the date when Quiz-Blog officially started. He then started sharing it with people, uploading different quizzes as he was also working with fellows on developing it to a more standard way.
                    </p>

                    <p>
                        Quiz-blog started with health sciences courses but now with the expanded team, it is making it a wide mean of helping people both Rwandans and others to sharpen their mind and perform better in classes and in different courses.
                    </p>

                    <hr className="my-2" style={{ height: "2px", borderWidth: 0, color: "#157A6E", backgroundColor: "#157A6E" }} />

                </Jumbotron>
            </Row>
        </div>
    )
}

export default Intro