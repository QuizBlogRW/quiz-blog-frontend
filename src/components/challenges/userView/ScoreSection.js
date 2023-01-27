import React, { useState, useContext } from 'react'
import { Button } from 'reactstrap'
import { Link } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
// import { PDFDownloadLink } from "@react-pdf/renderer"
// import PdfDocument from "../../webmaster/PdfDocument"
import MarksStatus from "./MarksStatus"
import LoginModal from '../../auth/LoginModal'
import { connect } from 'react-redux'
import { createChScore } from '../../../redux/challenges/challengeScores/challengeScores.actions'
import { currentUserContext } from '../../../appContexts'

const ScoreSection = ({ score, qnsLength, thisChQz, toReview, createChScore, chToReview, passMark }) => {

    // context
    const currentUser = useContext(currentUserContext)

    const uRole = currentUser && currentUser.role
    const uId = currentUser && currentUser._id
    const thisChQzId = thisChQz && thisChQz._id
    const thisChQzCatId = thisChQz && thisChQz.category && thisChQz.category._id
    const [newScoreId] = useState(uuidv4())

    return (
        <div className='p-sm-5 score-section text-center'>
            <h5>You got <b style={{ color: "#B4654A" }}>{score}</b> questions right from <b style={{ color: "#B4654A" }}>{qnsLength}</b>.

                <small className="text-info">
                    (~{Math.round(score * 100 / qnsLength)}%)
                </small>
            </h5>

            {/* Get ready */}
            <div className="my-sm-5 d-flex justify-content-around align-items-center">
                <a href={`/take-challenge/${thisChQz._id}`}>
                    <button type="button" className="btn btn-outline-success mt-3 mt-sm-0 mr-2 mr-md-0">
                        Retake
                    </button>
                </a>

                {uRole ?
                    createChScore({
                        id: newScoreId,
                        marks: score,
                        out_of: qnsLength,
                        category: thisChQzCatId,
                        quiz: thisChQzId,
                        review: chToReview,
                        taken_by: uId
                    }) &&
                    <>
                        <Button color="success" className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0">
                            <i className="fa fa-whatsapp"></i>&nbsp;
                            <a className="text-white" href={`https://api.whatsapp.com/send?phone=whatsappphonenumber&text=Attempt this ${thisChQz && thisChQz.title} quiz on Quiz Blog
                        \nhttps://www.quizblog.rw/view-quiz/${thisChQz && thisChQz.slug}`}>Share</a>
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
                            textColor={'text-info'} />
                    </button>}

                {(uRole === 'Admin' || uRole === 'SuperAdmin') ?
                    Object.entries(toReview).length > 0 ?
                        // <PDFDownloadLink
                        //     document={<PdfDocument review={toReview && toReview} />}
                        //     fileName={`${toReview.title && toReview.title.split(' ').join('-')}.pdf`}
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
                        : null : null}
            </div>

            <MarksStatus
                score={score}
                qnLength={qnsLength}
                passMark={passMark} />
        </div>
    )
}
export default connect(null, { createChScore })(ScoreSection)