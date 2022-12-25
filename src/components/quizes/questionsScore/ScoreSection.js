import React from 'react'
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom'
// import { PDFDownloadLink } from "@react-pdf/renderer";
// import PdfDocument from "../../webmaster/PdfDocument";
import MarksStatus from "./MarksStatus";
import LoginModal from '../../auth/LoginModal'
import { connect } from 'react-redux'
import { createScore } from '../../../redux/scores/scores.actions'

const ScoreSection = ({ newScoreId, score, qnsLength, thisQuiz, auth, toReview, createScore, quizToReview, passMark }) => {

    const uRole = auth.user && auth.user.role
    const uId = auth.user && auth.user._id
    const thisQuizId = thisQuiz && thisQuiz._id
    const thisQuizCatId = thisQuiz && thisQuiz.category && thisQuiz.category._id

    return (
        <div className='p-sm-5 score-section text-center'>
            <h5>You got <b style={{ color: "#B4654A" }}>{score}</b> questions right from <b style={{ color: "#B4654A" }}>{qnsLength}</b>.

                <small className="text-info">
                    (~{Math.round(score * 100 / qnsLength)}%)
                </small>
            </h5>

            {/* Get ready */}
            <div className="my-sm-5 d-flex justify-content-around align-items-center">
                <a href={`/view-quiz/${thisQuiz.slug}`}>
                    <button type="button" className="btn btn-outline-success mt-3 mt-sm-0 mr-2 mr-md-0">
                        Retake
                    </button>
                </a>

                {uRole ?
                    createScore({
                        id: newScoreId,
                        marks: score,
                        out_of: qnsLength,
                        category: thisQuizCatId,
                        quiz: thisQuizId,
                        review: quizToReview,
                        taken_by: uId
                    }) &&
                    <>
                        <Button color="success" className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0">
                            <i className="fa fa-whatsapp"></i>&nbsp;
                            <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Attempt this ${thisQuiz && thisQuiz.title} quiz on Quiz Blog
                        \nhttps://www.quizblog.rw/view-quiz/${thisQuiz && thisQuiz.slug}`}>Share</a>
                        </Button>
                        <Link to={`/review-quiz/${newScoreId && newScoreId}`}>
                            <button type="button" className="btn btn-outline-success mt-3">
                                Review Answers
                            </button>
                        </Link>
                    </> :

                    <button type="button" className="btn btn-outline-warning mt-3 mt-sm-0 p-0">
                        <LoginModal
                            textContent={'Login to review answers'}
                            textColor={'text-info'}
                            isAuthenticated={auth.isAuthenticated} />
                    </button>}

                {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                    // <PDFDownloadLink
                    //     document={<PdfDocument review={toReview} />}
                    //     fileName={`${toReview.title.split(' ').join('-')}.pdf`}
                    //     style={{
                    //         textDecoration: "none",
                    //         padding: "7px 12px",
                    //         color: "white",
                    //         backgroundColor: "#157a6e",
                    //         border: "1px solid #ffc107",
                    //         borderRadius: "4px",
                    //         display: "inline",
                    //         width: "fit-content",
                    //     }}
                    // >
                    //     {({ blob, url, loading, error }) =>
                    //         loading ? 'Preparing document...' : 'Download pdf'
                    //     }
                    // </PDFDownloadLink> 
                    <>Not available</>
                    : null}
            </div>

            <MarksStatus
                score={score}
                qnLength={qnsLength}
                passMark={passMark} />
        </div>
    )
}
export default connect(null, { createScore })(ScoreSection)