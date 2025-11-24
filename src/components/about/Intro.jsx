import { Row, Col } from 'reactstrap';
import reading from '@/images/reading.svg';

const Intro = () => {
    return (
        <div className="introduct pt-2 pt-lg-5">

            {/* Main Title */}
            <h1 className="display-4 fw-bolder text-center my-4 mb-lg-4" style={{ color: 'var(--brand)' }}>
                Get To Know <span>Quiz-Blog</span>
            </h1>

            {/* Intro Section */}
            <Row className="pt-lg-4 px-3 px-lg-5 align-items-center">
                <Col sm="6" className="mb-4 mb-sm-0 text-center">
                    <img src={reading} alt="Learning Illustration" className="img-fluid" />
                </Col>

                <Col sm="6" className="intro-text d-flex flex-column justify-content-center">
                    <h2 className="fw-bolder text-center mb-4" style={{ color: 'var(--brand)' }}>
                        Empowering Learners
                    </h2>

                    <p className="lead mb-3 text-center">
                        Quiz-Blog offers a wide range of quizzes and study resources to help students sharpen their skills and excel in exams. Our blog covers multiple subjects, providing insights that make learning easier and more effective.
                    </p>
                    <hr className="my-2" style={{ borderColor: 'var(--brand)' }} />
                </Col>
            </Row>

            {/* Journey Section */}
            <Row className="px-3 px-lg-5 mt-5">
                <div className="jbtron rounded px-3 px-sm-4 py-4 my-3 my-lg-5 shadow-sm bg-white">
                    <h2 className="fw-bolder text-center mb-4" style={{ color: 'var(--accent)' }}>
                        Our Journey
                    </h2>

                    <p className="text-center mb-3">
                        Bruce began university in 2019 and struggled to find enough practice materials for self-directed learning.
                        To solve this, he collaborated with his brother, a software developer, to create Quiz-Blog — a platform offering Multiple Choice Questions (MCQs) for students.
                        Initially focused on health sciences, Quiz-Blog now provides resources for various subjects, helping students in Rwanda and worldwide improve their academic performance.
                    </p>

                    <hr className="my-3" style={{ height: '2px', backgroundColor: 'var(--brand)', border: 'none' }} />
                </div>
            </Row>

        </div>
    );
};

export default Intro;
