import React, { useState, useEffect } from 'react'
import { Container, Col, Row, Spinner, Button } from 'reactstrap';
import { Link, useParams } from 'react-router-dom'
import ReactLoading from "react-loading";
import { connect } from 'react-redux'
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import PdfDocument from "../webmaster/PdfDocument";
import { getOneQuiz } from '../../redux/quizes/quizes.actions'
// import { createScore } from '../../redux/scores/scores.actions'
import { getUsers } from '../../redux/auth/auth.actions'
import { v4 as uuidv4 } from 'uuid';
import CountDown from './CountDown';
import LoginModal from '../auth/LoginModal'
import SpinningBubbles from '../rLoading/SpinningBubbles';
// import SimilarQuizes from './SimilarQuizes';

const SelectChallengee = ({ qZ, getOneQuiz, auth, createScore, getUsers, users }) => {

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [quizToReview, setQuizToReview] = useState({});
    const [newScoreId, setNewScoreId] = useState();
    const passMark = qZ.oneQuiz.category && qZ.oneQuiz.category._id === '60e9a2ba82f7830015c317f1' ? 80 : 50
    const reviewDetails = { review: quizToReview && quizToReview };

    // Access route parameters
    const { userId, quizSlug } = useParams()
    const chUser = users && users.users.find(user => user._id === userId ? user : null)

    useEffect(() => {
        getOneQuiz(quizSlug);
        getUsers();
    }, [getOneQuiz, getUsers, quizSlug]);

    const handleAnswerButtonClick = (event, isCorrect) => {

        if (isCorrect) {
            setScore(score + 1);
        }

        const nextQuestion = currentQuestion + 1;
        setNewScoreId(uuidv4())

        nextQuestion < qZ.oneQuiz.questions.length ?
            setCurrentQuestion(nextQuestion) : setShowScore(true)

        qZ.oneQuiz.questions[currentQuestion].answerOptions
            .map(opt => event && event.target.value === opt.answerText ?
                opt.choosen = true : opt.choosen = false)

        setQuizToReview({
            ...quizToReview,
            id: uuidv4(),
            title: qZ.oneQuiz.title,
            description: qZ.oneQuiz.description,
            questions: qZ.oneQuiz.questions
        })
    };

    const Reload = () => window.location.reload()

    auth.isAuthenticated ?

        !qZ.isLoading ?

            qZ.oneQuiz ?

                qZ.oneQuiz.questions.length > 0 ?

                    <div key={Math.floor(Math.random() * 1000)}>
                        <Container className="main d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">

                            {showScore ?

                                auth.isAuthenticated ?

                                    // createScore({
                                    //     id: newScoreId,
                                    //     marks: score && score,
                                    //     out_of: qZ.oneQuiz.questions.length,
                                    //     category: qZ.oneQuiz.category._id,
                                    //     quiz: qZ.oneQuiz._id,
                                    //     review: quizToReview && quizToReview,
                                    //     taken_by: auth.isLoading === false ? auth.user._id : null
                                    // }) &&

                                    <div className='score-section text-center'>
                                        <h5 className="d-flex justify-content-around">

                                            <b>You got <i style={{ color: "#B4654A" }}>{score}/{qZ.oneQuiz.questions.length} </i><small className="text-info">
                                                (~{Math.round(score * 100 / qZ.oneQuiz.questions.length)}%)
                                            </small></b>
                                            <b><i>|| {chUser && chUser.name} got 0/0</i></b>
                                        </h5>

                                        <Button color="success" className="mt-3 share-btn">
                                            <i className="fa fa-whatsapp"></i>&nbsp;
                                            <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Attempt this ${qZ.oneQuiz.title} on Quiz Blog
                        \nhttps://www.quizblog.rw/view-quiz/${qZ.oneQuiz.slug}`}>Share</a>
                                        </Button>

                                        <button type="button" className="btn btn-outline-success mt-3 mx-1 mx-md-3" onClick={Reload}>
                                            Retake
                                        </button>

                                        <Link to={`/review-quiz/${newScoreId && newScoreId}`}>
                                            <button type="button" className="btn btn-outline-success mt-3">
                                                Review Answers
                                            </button>
                                        </Link>

                                        {auth.user.role === 'Admin' ?
                                            // <PDFDownloadLink
                                            //     document={<PdfDocument review={reviewDetails.review} />}
                                            //     fileName={`${reviewDetails.review.title.split(' ').join('-')}.pdf`}
                                            //     style={{
                                            //         textDecoration: "none",
                                            //         padding: "3px 5px",
                                            //         color: "white",
                                            //         backgroundColor: "#157a6e",
                                            //         border: "1px solid #ffc107",
                                            //         borderRadius: "4px",
                                            //         display: "block",
                                            //         width: "fit-content",
                                            //         margin: "10px auto"
                                            //     }}
                                            // >
                                            //     {({ blob, url, loading, error }) =>
                                            //         loading ? 'Preparing document...' : 'Download pdf'
                                            //     }
                                            // </PDFDownloadLink> 
                                            <>Not available</>
                                            : null}

                                        <div className="marks-status">

                                            {Math.round(score * 100 / qZ.oneQuiz.questions.length) < passMark ?
                                                <>
                                                    <h6 className="text-center text-danger my-3">
                                                        You failed! you need more reading and practice to succeed. Please contact us for more important books, guidance that may help you.
                                                    </h6>

                                                    <Link to="/contact" className="text-success">
                                                        <button type="button" className="btn btn-outline-success">
                                                            Contact us for more
                                                        </button>
                                                    </Link>
                                                </>
                                                :
                                                <>
                                                    <h6 className="text-center text-success my-3">
                                                        Congratulations, you passed this test! Remember, the more you practice the more you understand! If you need any related book or help, don't hesitate to contact us!
                                                    </h6>
                                                    <Link to="/contact" className="text-success">
                                                        <button type="button" className="btn btn-outline-success">
                                                            Contact us for help!
                                                        </button>
                                                    </Link>
                                                </>}
                                        </div>

                                    </div> :

                                    <div className='score-section text-center'>

                                        <h5 className="d-flex justify-content-around">

                                            <b>You got <i style={{ color: "#B4654A" }}>{score}/{qZ.oneQuiz.questions.length} </i><small className="text-info">
                                                (~{Math.round(score * 100 / qZ.oneQuiz.questions.length)}%)
                                            </small></b>
                                            <b>|| <i>{chUser && chUser.name}</i> got 0/0</b>
                                        </h5>

                                        <a href={`/view-quiz/${qZ.oneQuiz.slug}`}>
                                            <button type="button" className="btn btn-outline-success mt-3 mr-2 mr-md-3" onClick={Reload}>
                                                Retake
                                            </button>
                                        </a>

                                        <button type="button" className="btn btn-outline-success mt-3 p-0">
                                            <LoginModal review={'Login to review answers'} textColor={'text-info'} />
                                        </button>

                                        <div className="marks-status">

                                            {Math.round(score * 100 / qZ.oneQuiz.questions.length) < passMark ?

                                                <>
                                                    <h6 className="text-center text-danger my-3">
                                                        You failed! you need more reading and practice to succeed. Please contact us for more important books, guidance that may help you.
                                                    </h6>

                                                    <Link to="/contact" className="text-success">
                                                        <button type="button" className="btn btn-outline-success">
                                                            Contact us for help!
                                                        </button>
                                                    </Link>
                                                </> :
                                                <>
                                                    <h6 className="text-center text-success my-3">
                                                        Congratulations, you passed this test! Remember, the more you practice the more you understand! If you need any related book or help, don't hesitate to contact us!
                                                    </h6>
                                                    <Link to="/contact" className="text-success">
                                                        <button type="button" className="btn btn-outline-success">
                                                            Contact us for help!
                                                        </button>
                                                    </Link>
                                                </>}
                                        </div>

                                    </div> :

                                chUser ?

                                    <div className="question-view">

                                        {/* Countdown */}
                                        <CountDown
                                            handleAnswerButtonClick={handleAnswerButtonClick}
                                            timeInSecs={qZ.oneQuiz.category._id === '60e9a2ba82f7830015c317f1' ?
                                                qZ.oneQuiz.questions[currentQuestion] && (qZ.oneQuiz.questions[currentQuestion].duration + 20) :
                                                qZ.oneQuiz.questions[currentQuestion] && qZ.oneQuiz.questions[currentQuestion].duration + 80} />

                                        {/* Question */}
                                        <Row>
                                            <Col>
                                                <div className='question-section my-2 mx-auto w-75'>
                                                    <p className="text-center">{chUser && `You are challenging ${chUser.name}`}</p>

                                                    <h4 className='question-count text-uppercase text-center text-secondary font-weight-bold'>
                                                        <span>Question <b style={{ color: "#B4654A" }}>
                                                            {currentQuestion + 1}</b>
                                                        </span>/{qZ.oneQuiz.questions.length}
                                                    </h4>

                                                    <h5 className='q-txt mt-4 font-weight-bold text-center'>{qZ.oneQuiz.questions[currentQuestion] && qZ.oneQuiz.questions[currentQuestion].questionText}</h5>
                                                </div>
                                            </Col>
                                        </Row>

                                        {/* Answers */}
                                        <Row>
                                            <Col>
                                                <div className='answer d-flex flex-column mx-auto mt-2 w-lg-50'>

                                                    {qZ.oneQuiz.questions && qZ.oneQuiz.questions[currentQuestion].answerOptions.sort(() => 0.5 - Math.random()).map((answerOption, index) => (

                                                        <li key={index} style={{ listStyleType: "upper-latin" }} className="text-info font-weight-bold">

                                                            <button
                                                                value={answerOption.answerText}
                                                                className="answer-option my-3 p-2 btn btn-outline-info rounded"
                                                                onClick={(e) => handleAnswerButtonClick(e, answerOption.isCorrect)}
                                                                style={{ width: "96%" }}>
                                                                {answerOption.answerText}
                                                            </button>

                                                        </li>
                                                    ))}

                                                </div>
                                            </Col>
                                        </Row>
                                    </div> :

                                    <div className="pt-5 d-flex justify-content-center align-items-center">
                                        <Spinner color="warning" style={{ width: '10rem', height: '10rem' }} />
                                    </div>}

                        </Container>

                        {/* {showScore ? <SimilarQuizes categoryId={qZ.oneQuiz.category && qZ.oneQuiz.category._id} /> : null} */}
                    </div> :

                    <Container className="main d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80">
                        <Row className="main d-flex flex-column justify-content-center rounded border border-primary my-5 py-4 w-80 text-center">
                            <h1 className="text-danger font-weight-bolder">404</h1>
                            <h4>No questions to show!</h4>
                            <Button color="info" style={{ width: "120px" }} className="mx-auto mt-4"><a href="/webmaster" className="text-white">Back</a></Button>
                        </Row>
                    </Container> :

                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <h4 className="pt-lg-5 mt-lg-5 text-danger">This quiz is unavailable! <a href="/allposts">click here for more quizes!</a></h4>
                </div> :

            <>
                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <Spinner color="warning" style={{ width: '10rem', height: '10rem' }} />
                </div>
                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <h4 className="blink_load">Loading questions ...</h4>
                </div>
                <div className="pt-5 d-flex justify-content-center align-items-center">
                    <Spinner type="grow" color="success" style={{ width: '10rem', height: '10rem' }} />
                </div>
            </> :

        // If not authenticated or loading
        <div className="vh-100 d-flex justify-content-center align-items-center text-danger">
            {
                auth.isLoading ?
                    <SpinningBubbles /> :
                    <LoginModal
                        textContent={'Login first'}
                        textColor={'text-danger font-weight-bolder my-5 border rounded'} />
            }
        </div>
}

const mapStateToProps = state => ({
    users: state.authReducer,
    qZ: state.quizesReducer
});

export default connect(mapStateToProps, { getUsers, getOneQuiz, createScore })(SelectChallengee)