import React, { lazy, Suspense } from 'react'
import ReactDOMServer from 'react-dom/server';
import { Button, Spinner } from 'reactstrap'
import { Link } from 'react-router-dom'
import html2pdf from 'html2pdf.js'

import MarksStatus from "./MarksStatus"
import LoginModal from '../../auth/LoginModal'
import { connect } from 'react-redux'
import { createScore } from '../../../redux/scores/scores.actions'
import PdfDocument from '../../webmaster/pdfs/PdfDocument'

const ResponsiveHorizontal = lazy(() => import('../../adsenses/ResponsiveHorizontal'))

const ScoreSection = ({ newScoreId, score, qnsLength, thisQuiz, auth, toReview, createScore, quizToReview, passMark }) => {

    const uRole = auth.user && auth.user.role
    const uId = auth.user && auth.user._id
    const thisQuizId = thisQuiz && thisQuiz._id
    const thisQuizTitle = thisQuiz && thisQuiz.title
    const thisQuizCatId = thisQuiz && thisQuiz.category && thisQuiz.category._id

    const createPDF = () => {
        // Select the web page element to convert to PDF
        const element = <PdfDocument review={toReview && toReview} />
        const elementString = ReactDOMServer.renderToString(element);

        // Set the PDF options
        const options = {
            margin: [0.1, 0.1, 0.1, 0.1],
            filename: `${thisQuizTitle}-shared-by-QuizBlog.pdf`,
            image: { type: 'jpeg', quality: 0.98, background: '#fff', border: '1px solid #fff' },
            html2canvas: { scale: 2, useCORS: true, logging: true, letterRendering: true, allowTaint: true, scrollX: 0, scrollY: -window.scrollY },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait', compressPDF: true, precision: 16 }
        }

        // Generate the PDF file
        html2pdf().set(options).from(elementString).save()
    }

    return (
        <div className='p-sm-5 score-section text-center' id='pdf-container'>

            <Suspense fallback={<div className="p-1 m-1 d-flex justify-content-center align-items-center w-100">
                <Spinner color="primary" />
            </div>}>
                <div className='w-100'>
                    {/* Google responsive 1 ad */}
                    <ResponsiveHorizontal />
                </div>
            </Suspense>

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
                            <Button outline color="success" className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0">
                                Review Answers
                            </Button>
                        </Link>

                        {(uRole === 'Admin' || uRole === 'SuperAdmin') &&
                            <Button color="success"
                                className="mt-3 mt-sm-0 share-btn mx-1 mx-md-0"
                                onClick={createPDF}>
                                Download PDF
                            </Button>}
                    </> :

                    <button type="button" className="btn btn-outline-warning mt-3 mt-sm-0 p-0">
                        <LoginModal
                            textContent={'Login to review answers'}
                            textColor={'text-info'} />
                    </button>}
            </div>

            <MarksStatus
                score={score}
                qnLength={qnsLength}
                passMark={passMark} />
        </div>
    )
}
export default connect(null, { createScore })(ScoreSection)